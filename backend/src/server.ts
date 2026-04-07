import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import crypto from 'node:crypto';
import pool from './db.js';
import { setupAdminRoutes } from './routes/adminRoutes.js';
import { sendOtpSms } from './utils/otpService.js';

const app = express();
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

app.use(
  cors(
    corsOrigins.length > 0
      ? { origin: corsOrigins }
      : undefined
  )
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = Number(process.env.PORT || 5001);
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 45);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const isValidMobile = (mobile: string) => /^\d{10}$/.test(String(mobile || '').trim());
const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const hashOtp = (otp: string) => crypto.createHash('sha256').update(String(otp)).digest('hex');

console.log('PostgreSQL Connected');

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/otp/send', async (req, res) => {
  try {
    const mobile = String(req.body?.mobile || '').trim();
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    }

    const recent = await pool.query(
      'SELECT "createdAt" FROM "MobileVerification" WHERE mobile = $1 ORDER BY "createdAt" DESC LIMIT 1',
      [mobile]
    );
    if (recent.rows[0]?.createdAt) {
      const lastSentAt = new Date(recent.rows[0].createdAt).getTime();
      const diffSec = Math.floor((Date.now() - lastSentAt) / 1000);
      if (diffSec < OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          error: `Please wait ${OTP_RESEND_COOLDOWN_SECONDS - diffSec}s before requesting another OTP.`
        });
      }
    }

    const otp = makeOtp();
    const correlationId = crypto.randomUUID();
    const insert = await pool.query(
      `INSERT INTO "MobileVerification"
      (id, mobile, "otpHash", "expiresAt", attempts, "createdAt", "updatedAt", "correlationId")
      VALUES (gen_random_uuid()::text, $1, $2, NOW() + ($3 || ' minutes')::interval, 0, NOW(), NOW(), $4)
      RETURNING id`,
      [mobile, hashOtp(otp), String(OTP_EXPIRY_MINUTES), correlationId]
    );

    let smsResult: { mocked?: boolean } = {};
    try {
      smsResult = await sendOtpSms({
        mobile,
        otp,
        minutes: OTP_EXPIRY_MINUTES,
        correlationId
      });
    } catch (smsErr: any) {
      await pool.query('DELETE FROM "MobileVerification" WHERE id = $1', [insert.rows[0].id]);
      return res.status(502).json({ error: smsErr?.message || 'Failed to send OTP SMS.' });
    }

    const response: Record<string, unknown> = {
      ok: true,
      message: 'OTP sent successfully.',
      expiresInMinutes: OTP_EXPIRY_MINUTES
    };

    if (
      process.env.NODE_ENV !== 'production' &&
      (process.env.EXPOSE_DEV_OTP === 'true' || smsResult.mocked)
    ) {
      response.devOtp = otp;
    }

    return res.json(response);
  } catch (err: any) {
    console.error('OTP send error:', err?.message || err);
    return res.status(500).json({ error: 'Could not send OTP right now.' });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  try {
    const mobile = String(req.body?.mobile || '').trim();
    const otp = String(req.body?.otp || '').trim();

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Please provide a valid 6-digit OTP.' });
    }

    const latest = await pool.query(
      `SELECT id, "otpHash", attempts, "expiresAt"
       FROM "MobileVerification"
       WHERE mobile = $1 AND "verifiedAt" IS NULL
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [mobile]
    );

    if (latest.rowCount === 0) {
      return res.status(400).json({ error: 'No OTP request found. Please request OTP again.' });
    }

    const row = latest.rows[0];
    const expiresAtMs = new Date(row.expiresAt).getTime();
    if (Number.isNaN(expiresAtMs) || expiresAtMs < Date.now()) {
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    const attempts = Number(row.attempts || 0);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Too many invalid attempts. Please request a new OTP.' });
    }

    const otpMatches = hashOtp(otp) === String(row.otpHash);
    if (!otpMatches) {
      await pool.query('UPDATE "MobileVerification" SET attempts = attempts + 1, "updatedAt" = NOW() WHERE id = $1', [row.id]);
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    const verificationToken = crypto.randomUUID();
    await pool.query(
      `UPDATE "MobileVerification"
       SET "verifiedAt" = NOW(), "verificationToken" = $2, "updatedAt" = NOW()
       WHERE id = $1`,
      [row.id, verificationToken]
    );

    return res.json({ ok: true, verificationToken });
  } catch (err: any) {
    console.error('OTP verify error:', err?.message || err);
    return res.status(500).json({ error: 'Could not verify OTP right now.' });
  }
});

// Basic API to register student (Initial step)
app.post('/api/student/register', async (req, res) => {
  console.log('Register called:', req.body);
  try {
    const { name, mobile, email, location, otpToken } = req.body;

    if (!isValidMobile(String(mobile || ''))) {
      return res.status(400).json({ error: 'Valid mobile number is required.' });
    }
    if (!otpToken) {
      return res.status(403).json({ error: 'OTP verification is required before starting the test.' });
    }

    const tokenConsume = await pool.query(
      `UPDATE "MobileVerification"
       SET "tokenConsumedAt" = NOW(), "updatedAt" = NOW()
       WHERE mobile = $1
         AND "verificationToken" = $2
         AND "verifiedAt" IS NOT NULL
         AND "tokenConsumedAt" IS NULL
         AND "expiresAt" > NOW()
       RETURNING id`,
      [mobile, otpToken]
    );

    if (tokenConsume.rowCount === 0) {
      return res.status(403).json({ error: 'OTP verification is invalid or expired. Please verify again.' });
    }

    const result = await pool.query(
      'INSERT INTO "Student" (id, name, mobile, email, location, status, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [name, mobile, email, location, 'Partial']
    );
    console.log('Inserted:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Register error:', err.message);
    res.status(400).json({ error: 'Failed to register' });
  }
});

// Update progress (Answers as they go)
app.post('/api/student/update-progress/:id', async (req, res) => {
  try {
    const { answers } = req.body;
    const result = await pool.query(
      'UPDATE "Student" SET answers = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(answers), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update progress' });
  }
});

// Final submit
app.post('/api/student/complete/:id', async (req, res) => {
  try {
    const { answers, result } = req.body;
    const dbResult = await pool.query(
      'UPDATE "Student" SET answers = $1, result = $2, status = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [JSON.stringify(answers), JSON.stringify(result), 'Completed', req.params.id]
    );
    res.json(dbResult.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Failed to complete test' });
  }
});

// Admin view students & exports
setupAdminRoutes(app);

// Start Server
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
