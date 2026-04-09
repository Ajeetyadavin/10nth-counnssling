import pool from '../db.js';
import { generateReportPDF } from '../utils/pdfGenerator.js';
import { seedQuestionsIfEmpty } from '../seeds.js';
import { signAdminToken } from '../middleware/adminAuth.js';
import type { Express } from 'express';

const ensureTables = async () => {
  // Student table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Student" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      answers JSONB NOT NULL DEFAULT '[]',
      result JSONB,
      status TEXT NOT NULL DEFAULT 'Partial',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Question table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Question" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      text TEXT NOT NULL,
      options JSONB NOT NULL,
      category TEXT DEFAULT 'neutral',
      "order" INT NOT NULL DEFAULT 0,
      hidden BOOLEAN NOT NULL DEFAULT FALSE,
      fixed BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Backward compatibility for already-created tables
  await pool.query('ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS fixed BOOLEAN NOT NULL DEFAULT FALSE');
  await pool.query('ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE');
  await pool.query('ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT \'hinglish\'');

  // AdminSettings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "AdminSettings" (
      id INT PRIMARY KEY,
      "questionLimit" INT NOT NULL DEFAULT 45,
      "otpRequired" BOOLEAN NOT NULL DEFAULT TRUE,
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "otpRequired" BOOLEAN NOT NULL DEFAULT TRUE');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "MobileVerification" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      mobile TEXT NOT NULL,
      "otpHash" TEXT NOT NULL,
      attempts INT NOT NULL DEFAULT 0,
      "expiresAt" TIMESTAMP NOT NULL,
      "verifiedAt" TIMESTAMP,
      "verificationToken" TEXT,
      "tokenConsumedAt" TIMESTAMP,
      "correlationId" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_mobile_verification_mobile_created ON "MobileVerification" (mobile, "createdAt" DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_mobile_verification_token ON "MobileVerification" ("verificationToken")');

  await pool.query(`
    INSERT INTO "AdminSettings" (id, "questionLimit", "otpRequired", "updatedAt")
    VALUES (1, 45, TRUE, NOW())
    ON CONFLICT (id) DO NOTHING
  `);
};

const csvEscape = (value: unknown) => {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const setupAdminRoutes = (app: Express) => {
  ensureTables()
    .then(() => seedQuestionsIfEmpty())
    .catch((err) => console.error('Failed to initialize tables/seed:', err));

  app.post('/api/admin/auth/login', async (req, res) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '').trim();
    const expectedUsername = String(process.env.ADMIN_USERNAME || '').trim();
    const expectedPassword = String(process.env.ADMIN_PASSWORD || '').trim();

    if (!expectedUsername || !expectedPassword) {
      return res.status(503).json({ error: 'Admin credentials are not configured on server.' });
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    try {
      const token = signAdminToken(username);
      return res.json({ ok: true, token });
    } catch (err: any) {
      console.error('Admin login token error:', err?.message || err);
      return res.status(503).json({ error: 'Admin auth is not configured on server.' });
    }
  });

  // Get all students
  app.get('/api/admin/students', async (req, res) => {
    try {
      console.log('Fetching students from PostgreSQL...');
      const { status } = req.query;
      let query = 'SELECT * FROM "Student"';
      let params: any[] = [];
      
      if (status && status !== '') {
        query += ' WHERE status = $1';
        params = [status];
      }
      
      query += ' ORDER BY "createdAt" DESC';
      
      const result = await pool.query(query, params);
      console.log('Found students:', result.rows.length);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch students' });
    }
  });

  // Export CSV
  app.get('/api/admin/export', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Student"');
      const students = result.rows;
      const csv =
        'Name,Mobile,Email,Location,Status,Result,CreatedDate,CreatedTime,CreatedTimestamp\n' +
        students
          .map((s: any) => {
            const createdAt = new Date(s.createdAt);
            const date = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleDateString('en-IN');
            const time = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleTimeString('en-IN');
            const iso = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toISOString();
            const resultName = typeof s.result === 'object' && s.result ? s.result.name || '' : '';

            return [
              csvEscape(s.name),
              csvEscape(s.mobile),
              csvEscape(s.email),
              csvEscape(s.location),
              csvEscape(s.status),
              csvEscape(resultName || 'N/A'),
              csvEscape(date),
              csvEscape(time),
              csvEscape(iso)
            ].join(',');
          })
          .join('\n');
      
      res.header('Content-Type', 'text/csv');
      res.attachment('students_data.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).json({ error: 'Export failed' });
    }
  });

  // Download individual PDF
  // Generate report by mobile number (for user download) — must be BEFORE /:id route
  app.get('/api/admin/report/generate', async (req, res) => {
    try {
      const { mobile } = req.query;
      if (!mobile) return res.status(400).send('Mobile number is required');
      const result = await pool.query(
        'SELECT * FROM "Student" WHERE mobile = $1 ORDER BY "createdAt" DESC LIMIT 1',
        [mobile]
      );
      const student = result.rows[0];
      if (!student) return res.status(404).send('No completed test found for this mobile number');
      if (student.status !== 'Completed' || !student.result)
        return res.status(403).send('Test not completed yet');
      const pdfBuffer = await generateReportPDF(student);
      res.contentType('application/pdf');
      res.attachment(`Report_${student.name}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Error generating report:', err);
      res.status(500).send('PDF Generation Error');
    }
  });

  app.get('/api/admin/report/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Student" WHERE id = $1', [req.params.id]);
      const student = result.rows[0];
      if (!student) return res.status(404).send('Student not found');
      
      const pdfBuffer = await generateReportPDF(student);
      res.contentType('application/pdf');
      res.attachment(`Report_${student.name}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      res.status(500).send('PDF Generation Error');
    }
  });

  // Generate report by mobile number (for user download)
  // Questions Management
  app.get('/api/admin/questions', async (req, res) => {
    try {
      console.log('Fetching questions from PostgreSQL...');
      const includeHidden = req.query.includeHidden === '1' || req.query.includeHidden === 'true';
      const language = req.query.language as string | undefined;

      const conditions: string[] = [];
      const params: any[] = [];

      if (!includeHidden) {
        conditions.push('"hidden" = FALSE');
      }

      if (language && (language === 'hinglish' || language === 'english')) {
        params.push(language);
        conditions.push(`language = $${params.length}`);
      }

      const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
      const query = `SELECT * FROM "Question"${whereClause} ORDER BY "order" ASC, "createdAt" DESC`;

      const result = await pool.query(query, params);
      console.log('Found questions:', result.rows.length);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.get('/api/admin/questions/export', async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT text, options, category, hidden, fixed, "order" FROM "Question" ORDER BY "order" ASC, "createdAt" ASC'
      );

      const payload = {
        exportedAt: new Date().toISOString(),
        count: result.rows.length,
        questions: result.rows.map((q: any) => ({
          text: q.text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
          category: q.category || 'neutral',
          hidden: Boolean(q.hidden),
          fixed: Boolean(q.fixed),
          order: Number(q.order) || 0
        }))
      };

      res.header('Content-Type', 'application/json');
      res.attachment(`questions_export_${Date.now()}.json`);
      res.send(JSON.stringify(payload, null, 2));
    } catch (err: any) {
      console.error('Error exporting questions:', err);
      res.status(500).json({ error: 'Failed to export questions' });
    }
  });

  app.post('/api/admin/questions/import', async (req, res) => {
    const client = await pool.connect();
    try {
      const mode = req.body?.mode === 'replace' ? 'replace' : 'merge';
      const incoming = Array.isArray(req.body?.questions)
        ? req.body.questions
        : Array.isArray(req.body)
          ? req.body
          : [];

      if (incoming.length === 0) {
        return res.status(400).json({ error: 'questions array required' });
      }

      const normalized = incoming
        .map((q: any, idx: number) => {
          const text = String(q?.text || q?.question || '').trim();
          const options = Array.isArray(q?.options) ? q.options : [];
          const cleanedOptions = options
            .map((o: any) => ({
              text: String(o?.text || '').trim(),
              stream: String(o?.stream || 'neutral').toLowerCase(),
              weight: Number(o?.weight) || 1
            }))
            .filter((o: any) => o.text.length > 0);

          return {
            text,
            options: cleanedOptions,
            category: String(q?.category || 'neutral').toLowerCase(),
            hidden: Boolean(q?.hidden),
            fixed: Boolean(q?.fixed),
            order: Number.isInteger(Number(q?.order)) ? Number(q.order) : idx
          };
        })
        .filter((q: any) => q.text.length > 0 && q.options.length > 0);

      if (normalized.length === 0) {
        return res.status(400).json({ error: 'No valid questions to import' });
      }

      await client.query('BEGIN');

      if (mode === 'replace') {
        await client.query('DELETE FROM "Question"');
      }

      const existingRows = await client.query('SELECT id, text FROM "Question"');
      const existingByText = new Map(
        existingRows.rows.map((r: any) => [String(r.text).trim().toLowerCase(), r.id])
      );

      let inserted = 0;
      let updated = 0;
      let skipped = 0;

      for (const q of normalized) {
        const key = q.text.toLowerCase();
        const existingId = existingByText.get(key);

        if (existingId) {
          await client.query(
            'UPDATE "Question" SET options = $1, category = $2, hidden = $3, fixed = $4, "order" = $5 WHERE id = $6',
            [JSON.stringify(q.options), q.category, q.hidden, q.fixed, q.order, existingId]
          );
          updated += 1;
          continue;
        }

        await client.query(
          'INSERT INTO "Question" (text, options, category, hidden, fixed, "order") VALUES ($1, $2, $3, $4, $5, $6)',
          [q.text, JSON.stringify(q.options), q.category, q.hidden, q.fixed, q.order]
        );
        inserted += 1;
        existingByText.set(key, true as any);
      }

      skipped = incoming.length - normalized.length;

      await client.query('COMMIT');
      res.json({ mode, received: incoming.length, imported: normalized.length, inserted, updated, skipped });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('Error importing questions:', err);
      res.status(500).json({ error: 'Failed to import questions' });
    } finally {
      client.release();
    }
  });

  app.post('/api/admin/questions', async (req, res) => {
    try {
      const { text, options, category, hidden, fixed, language } = req.body;
      console.log('Adding new question:', text);
      const result = await pool.query(
        'INSERT INTO "Question" (text, options, category, hidden, fixed, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden), Boolean(fixed), language || 'hinglish']
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Error adding question:', err);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  app.put('/api/admin/questions/:id', async (req, res) => {
    try {
      const { text, options, category, hidden, fixed, language } = req.body;
      console.log('Updating question:', req.params.id);
      const result = await pool.query(
        'UPDATE "Question" SET text = $1, options = $2, category = $3, hidden = $4, fixed = $5, language = $6 WHERE id = $7 RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden), Boolean(fixed), language || 'hinglish', req.params.id]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Error updating question:', err);
      res.status(500).json({ error: 'Failed to update question' });
    }
  });

  app.delete('/api/admin/questions/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM "Question" WHERE id = $1', [req.params.id]);
      res.json({ message: 'Question deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  app.put('/api/admin/questions/visibility/bulk', async (req, res) => {
    try {
      const { ids, hidden } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array is required' });
      }

      const sanitizedIds = ids.filter((id) => typeof id === 'string' && id.trim().length > 0);
      if (sanitizedIds.length === 0) {
        return res.status(400).json({ error: 'No valid ids provided' });
      }

      const result = await pool.query(
        'UPDATE "Question" SET hidden = $1 WHERE id = ANY($2::text[]) RETURNING *',
        [Boolean(hidden), sanitizedIds]
      );

      res.json({ updatedCount: result.rowCount, rows: result.rows });
    } catch (err: any) {
      console.error('Error bulk updating question visibility:', err);
      res.status(500).json({ error: 'Failed to update visibility' });
    }
  });

  app.put('/api/admin/questions/fixed/bulk', async (req, res) => {
    try {
      const { ids, fixed } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array is required' });
      }

      const sanitizedIds = ids.filter((id) => typeof id === 'string' && id.trim().length > 0);
      if (sanitizedIds.length === 0) {
        return res.status(400).json({ error: 'No valid ids provided' });
      }

      const result = await pool.query(
        'UPDATE "Question" SET fixed = $1 WHERE id = ANY($2::text[]) RETURNING *',
        [Boolean(fixed), sanitizedIds]
      );

      res.json({ updatedCount: result.rowCount, rows: result.rows });
    } catch (err: any) {
      console.error('Error bulk updating question fixed flag:', err);
      res.status(500).json({ error: 'Failed to update fixed flag' });
    }
  });

  // Settings: question count for test
  app.get('/api/admin/settings', async (_req, res) => {
    try {
      const result = await pool.query('SELECT "questionLimit", "otpRequired", "updatedAt" FROM "AdminSettings" WHERE id = 1');
      const row = result.rows[0] || { questionLimit: 45, otpRequired: true };
      res.json({
        questionLimit: Number(row.questionLimit) || 45,
        otpRequired: row.otpRequired !== false,
        updatedAt: row.updatedAt
      });
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/settings', async (req, res) => {
    try {
      const existing = await pool.query('SELECT "questionLimit", "otpRequired" FROM "AdminSettings" WHERE id = 1');
      const current = existing.rows[0] || { questionLimit: 45, otpRequired: true };

      const nextLimitRaw = req.body?.questionLimit ?? current.questionLimit;
      const nextLimit = Number(nextLimitRaw);
      if (!Number.isInteger(nextLimit) || nextLimit < 1 || nextLimit > 200) {
        return res.status(400).json({ error: 'questionLimit must be an integer between 1 and 200' });
      }

      const nextOtpRequired = req.body?.otpRequired === undefined
        ? (current.otpRequired !== false)
        : Boolean(req.body.otpRequired);

      const result = await pool.query(
        `UPDATE "AdminSettings"
         SET "questionLimit" = $1, "otpRequired" = $2, "updatedAt" = NOW()
         WHERE id = 1
         RETURNING "questionLimit", "otpRequired", "updatedAt"`,
        [nextLimit, nextOtpRequired]
      );

      res.json({
        questionLimit: Number(result.rows[0]?.questionLimit) || nextLimit,
        otpRequired: result.rows[0]?.otpRequired !== false,
        updatedAt: result.rows[0]?.updatedAt
      });
    } catch (err: any) {
      console.error('Error updating settings:', err);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Delete student
  app.delete('/api/admin/student/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM "Student" WHERE id = $1', [req.params.id]);
      res.json({ message: 'Student deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // OTP Verification Data
  app.get('/api/admin/otp-verification', async (req, res) => {
    try {
      const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

      // Verified users (successfully completed OTP)
      const verifiedResult = await pool.query(`
        SELECT 
          mobile,
          "verifiedAt" as "verifiedAt",
          "createdAt" as "otpRequestedAt",
          attempts as "attemptsTaken",
          "correlationId"
        FROM "MobileVerification"
        WHERE "verifiedAt" IS NOT NULL
        ORDER BY "verifiedAt" DESC
      `);

      // Failed/Incomplete attempts (wrong OTP or expired)
      const failedResult = await pool.query(`
        SELECT 
          mobile,
          "expiresAt",
          attempts,
          "createdAt" as "otpRequestedAt",
          CASE 
            WHEN attempts >= $1 THEN 'Max attempts exceeded'
            WHEN "expiresAt" < NOW() THEN 'OTP expired'
            ELSE 'Not attempted'
          END as "failureReason",
          "correlationId"
        FROM "MobileVerification"
        WHERE "verifiedAt" IS NULL
        ORDER BY "createdAt" DESC
      `, [OTP_MAX_ATTEMPTS]);

      res.json({
        verified: verifiedResult.rows,
        failed: failedResult.rows,
        verifiedCount: verifiedResult.rowCount || 0,
        failedCount: failedResult.rowCount || 0,
        totalAttempts: (verifiedResult.rowCount || 0) + (failedResult.rowCount || 0)
      });
    } catch (err: any) {
      console.error('Error fetching OTP verification data:', err);
      res.status(500).json({ error: 'Failed to fetch OTP verification data' });
    }
  });
};
