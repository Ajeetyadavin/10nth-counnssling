import pool from '../db.js';
import { generateReportPDF } from '../utils/pdfGenerator.js';
import { seedQuestionsIfEmpty } from '../seeds.js';
import { signAdminToken } from '../middleware/adminAuth.js';
import type { Express, Request } from 'express';

const DEFAULT_CTA_MESSAGE = 'Hey, I need my Career Counselling Report';
const DEFAULT_CONTACT_NUMBER = '8651014840';

const ensureTables = async () => {
  // Student table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Student" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'ednovate',
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
      source TEXT NOT NULL DEFAULT 'ednovate',
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
  await pool.query('ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT \'ednovate\'');
  await pool.query(
    `UPDATE "Question"
     SET source = CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END
     WHERE source IS NULL OR source <> CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END`
  );
  await pool.query('ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT \'ednovate\'');
  await pool.query(
    `UPDATE "Student"
     SET source = CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END
     WHERE source IS NULL OR source <> CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END`
  );

  // AdminSettings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "AdminSettings" (
      id INT PRIMARY KEY,
      "questionLimit" INT NOT NULL DEFAULT 45,
      "ednovateQuestionLimit" INT NOT NULL DEFAULT 45,
      "dubeyQuestionLimit" INT NOT NULL DEFAULT 45,
      "otpRequired" BOOLEAN NOT NULL DEFAULT TRUE,
      "ednovateOtpRequired" BOOLEAN NOT NULL DEFAULT TRUE,
      "dubeyOtpRequired" BOOLEAN NOT NULL DEFAULT TRUE,
      "ednovateContactNumber" TEXT NOT NULL DEFAULT '8651014840',
      "dubeyContactNumber" TEXT NOT NULL DEFAULT '8651014840',
      "ednovateWhatsappMessage" TEXT NOT NULL DEFAULT 'Hey, I need my Career Counselling Report',
      "dubeyWhatsappMessage" TEXT NOT NULL DEFAULT 'Hey, I need my Career Counselling Report',
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "ednovateQuestionLimit" INT NOT NULL DEFAULT 45');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "dubeyQuestionLimit" INT NOT NULL DEFAULT 45');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "otpRequired" BOOLEAN NOT NULL DEFAULT TRUE');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "ednovateOtpRequired" BOOLEAN NOT NULL DEFAULT TRUE');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "dubeyOtpRequired" BOOLEAN NOT NULL DEFAULT TRUE');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "ednovateContactNumber" TEXT NOT NULL DEFAULT \'8651014840\'');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "dubeyContactNumber" TEXT NOT NULL DEFAULT \'8651014840\'');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "ednovateWhatsappMessage" TEXT NOT NULL DEFAULT \'Hey, I need my Career Counselling Report\'');
  await pool.query('ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "dubeyWhatsappMessage" TEXT NOT NULL DEFAULT \'Hey, I need my Career Counselling Report\'');

  await pool.query(
    `UPDATE "AdminSettings"
     SET
       "ednovateQuestionLimit" = COALESCE("ednovateQuestionLimit", "questionLimit", 45),
       "dubeyQuestionLimit" = COALESCE("dubeyQuestionLimit", "questionLimit", 45),
       "ednovateOtpRequired" = COALESCE("ednovateOtpRequired", "otpRequired", TRUE),
       "dubeyOtpRequired" = COALESCE("dubeyOtpRequired", TRUE),
       "ednovateContactNumber" = COALESCE(NULLIF(TRIM("ednovateContactNumber"), ''), $1),
       "dubeyContactNumber" = COALESCE(NULLIF(TRIM("dubeyContactNumber"), ''), $1),
       "ednovateWhatsappMessage" = COALESCE(NULLIF(TRIM("ednovateWhatsappMessage"), ''), $2),
       "dubeyWhatsappMessage" = COALESCE(NULLIF(TRIM("dubeyWhatsappMessage"), ''), $2)
     WHERE id = 1`,
    [DEFAULT_CONTACT_NUMBER, DEFAULT_CTA_MESSAGE]
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "MobileVerification" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      mobile TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'ednovate',
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

  await pool.query('ALTER TABLE "MobileVerification" ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT \'ednovate\'');
  await pool.query(
    `UPDATE "MobileVerification"
     SET source = CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END
     WHERE source IS NULL OR source <> CASE WHEN LOWER(TRIM(source)) = 'dubey' THEN 'dubey' ELSE 'ednovate' END`
  );

  await pool.query('CREATE INDEX IF NOT EXISTS idx_mobile_verification_mobile_created ON "MobileVerification" (mobile, "createdAt" DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_mobile_verification_token ON "MobileVerification" ("verificationToken")');

  await pool.query(`
    INSERT INTO "AdminSettings"
      (id, "questionLimit", "ednovateQuestionLimit", "dubeyQuestionLimit", "otpRequired", "ednovateOtpRequired", "dubeyOtpRequired", "ednovateContactNumber", "dubeyContactNumber", "ednovateWhatsappMessage", "dubeyWhatsappMessage", "updatedAt")
    VALUES (1, 45, 45, 45, TRUE, TRUE, TRUE, '8651014840', '8651014840', 'Hey, I need my Career Counselling Report', 'Hey, I need my Career Counselling Report', NOW())
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

const getAdminScope = (req: Request): 'all' | 'dubey' => {
  const scope = (req as any)?.adminAuth?.scope;
  return scope === 'dubey' ? 'dubey' : 'all';
};

const normalizeContactNumber = (value: unknown): string => String(value || '').replace(/\D/g, '').slice(0, 15);

const normalizeWhatsappMessage = (value: unknown): string => {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? cleaned.slice(0, 300) : DEFAULT_CTA_MESSAGE;
};

const getSourceContactConfig = async (source: 'ednovate' | 'dubey') => {
  const result = await pool.query(
    'SELECT "ednovateContactNumber", "dubeyContactNumber", "ednovateWhatsappMessage", "dubeyWhatsappMessage" FROM "AdminSettings" WHERE id = 1'
  );
  const row = result.rows[0] || {};

  if (source === 'dubey') {
    const contactNumber = normalizeContactNumber(row.dubeyContactNumber) || DEFAULT_CONTACT_NUMBER;
    return {
      contactNumber,
      whatsappMessage: normalizeWhatsappMessage(row.dubeyWhatsappMessage)
    };
  }

  const contactNumber = normalizeContactNumber(row.ednovateContactNumber) || DEFAULT_CONTACT_NUMBER;
  return {
    contactNumber,
    whatsappMessage: normalizeWhatsappMessage(row.ednovateWhatsappMessage)
  };
};

export const setupAdminRoutes = (app: Express) => {
  ensureTables()
    .then(() => seedQuestionsIfEmpty())
    .catch((err) => console.error('Failed to initialize tables/seed:', err));

  app.post('/api/admin/auth/login', async (req, res) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '').trim();
    const requestedSource = String(req.body?.source || req.headers['x-app-source'] || '')
      .trim()
      .toLowerCase();
    const allUsername = String(process.env.ADMIN_USERNAME || '').trim();
    const allPassword = String(process.env.ADMIN_PASSWORD || '').trim();
    const dubeyUsername = String(process.env.DUBEY_ADMIN_USERNAME || '').trim();
    const dubeyPassword = String(process.env.DUBEY_ADMIN_PASSWORD || '').trim();

    if ((!allUsername || !allPassword) && (!dubeyUsername || !dubeyPassword)) {
      return res.status(503).json({ error: 'Admin credentials are not configured on server.' });
    }

    let scope: 'all' | 'dubey' | null = null;
    if (requestedSource === 'dubey') {
      if (dubeyUsername && dubeyPassword && username === dubeyUsername && password === dubeyPassword) {
        scope = 'dubey';
      }
    } else if (allUsername && allPassword && username === allUsername && password === allPassword) {
      scope = 'all';
    } else if (dubeyUsername && dubeyPassword && username === dubeyUsername && password === dubeyPassword) {
      scope = 'dubey';
    }

    if (!scope) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    try {
      const token = signAdminToken(username, scope);
      return res.json({ ok: true, token, scope });
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
      const scope = getAdminScope(req);
      let query = 'SELECT * FROM "Student"';
      let params: any[] = [];
      const conditions: string[] = [];

      if (scope === 'dubey') {
        params.push('dubey');
        conditions.push(`LOWER(TRIM(source)) = $${params.length}`);
      }
      
      if (status && status !== '') {
        params.push(status);
        conditions.push(`status = $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
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
      const scope = getAdminScope(req);
      const result =
        scope === 'dubey'
          ? await pool.query('SELECT * FROM "Student" WHERE LOWER(TRIM(source)) = $1', ['dubey'])
          : await pool.query('SELECT * FROM "Student"');
      const students = result.rows;
      const csv =
        'Name,Brand,Mobile,Email,Location,Status,Result,CreatedDate,CreatedTime,CreatedTimestamp\n' +
        students
          .map((s: any) => {
            const createdAt = new Date(s.createdAt);
            const date = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleDateString('en-IN');
            const time = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleTimeString('en-IN');
            const iso = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toISOString();
            const resultName = typeof s.result === 'object' && s.result ? s.result.name || '' : '';

            return [
              csvEscape(s.name),
              csvEscape((s.source || 'ednovate') === 'dubey' ? 'Dubey' : 'Ednovate'),
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
      const scope = getAdminScope(req);
      if (!mobile) return res.status(400).send('Mobile number is required');
      const result =
        scope === 'dubey'
          ? await pool.query(
              'SELECT * FROM "Student" WHERE mobile = $1 AND LOWER(TRIM(source)) = $2 ORDER BY "createdAt" DESC LIMIT 1',
              [mobile, 'dubey']
            )
          : await pool.query(
              'SELECT * FROM "Student" WHERE mobile = $1 ORDER BY "createdAt" DESC LIMIT 1',
              [mobile]
            );
      const student = result.rows[0];
      if (!student) return res.status(404).send('No completed test found for this mobile number');
      if (student.status !== 'Completed' || !student.result)
        return res.status(403).send('Test not completed yet');
      const source = String(student.source || '').toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
      const contactConfig = await getSourceContactConfig(source);
      const pdfBuffer = await generateReportPDF(student, contactConfig, { source });
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
      const scope = getAdminScope(req);
      const result =
        scope === 'dubey'
          ? await pool.query('SELECT * FROM "Student" WHERE id = $1 AND LOWER(TRIM(source)) = $2', [req.params.id, 'dubey'])
          : await pool.query('SELECT * FROM "Student" WHERE id = $1', [req.params.id]);
      const student = result.rows[0];
      if (!student) return res.status(404).send('Student not found');

      const source = String(student.source || '').toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
      const contactConfig = await getSourceContactConfig(source);
      const pdfBuffer = await generateReportPDF(student, contactConfig, { source });
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
      const scope = getAdminScope(req);

      const conditions: string[] = [];
      const params: any[] = [];

      if (!includeHidden) {
        conditions.push('"hidden" = FALSE');
      }

      if (language && (language === 'hinglish' || language === 'english')) {
        params.push(language);
        conditions.push(`language = $${params.length}`);
      }

      if (scope === 'dubey') {
        params.push('dubey');
        conditions.push(`LOWER(TRIM(source)) = $${params.length}`);
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

  app.get('/api/admin/questions/export', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      const result = scope === 'dubey'
        ? await pool.query(
            'SELECT text, options, category, hidden, fixed, "order", source FROM "Question" WHERE LOWER(TRIM(source)) = $1 ORDER BY "order" ASC, "createdAt" ASC',
            ['dubey']
          )
        : await pool.query(
            'SELECT text, options, category, hidden, fixed, "order", source FROM "Question" ORDER BY "order" ASC, "createdAt" ASC'
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
          , source: String(q.source || 'ednovate').trim().toLowerCase() === 'dubey' ? 'dubey' : 'ednovate'
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
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
      const targetSource = String(req.body?.source || 'ednovate').trim().toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
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
            'INSERT INTO "Question" (text, options, category, hidden, fixed, "order", source) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [q.text, JSON.stringify(q.options), q.category, q.hidden, q.fixed, q.order, targetSource]
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
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
      const { text, options, category, hidden, fixed, language } = req.body;
      const source = String(req.body?.source || 'ednovate').trim().toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
      console.log('Adding new question:', text);
      const result = await pool.query(
        'INSERT INTO "Question" (text, options, category, hidden, fixed, language, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden), Boolean(fixed), language || 'hinglish', source]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Error adding question:', err);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  app.put('/api/admin/questions/:id', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
      const { text, options, category, hidden, fixed, language } = req.body;
      const source = String(req.body?.source || 'ednovate').trim().toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
      console.log('Updating question:', req.params.id);
      const result = await pool.query(
        'UPDATE "Question" SET text = $1, options = $2, category = $3, hidden = $4, fixed = $5, language = $6, source = $7 WHERE id = $8 RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden), Boolean(fixed), language || 'hinglish', source, req.params.id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Question not found in current scope' });
      }
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Error updating question:', err);
      res.status(500).json({ error: 'Failed to update question' });
    }
  });

  app.delete('/api/admin/questions/:id', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
      await pool.query('DELETE FROM "Question" WHERE id = $1', [req.params.id]);
      res.json({ message: 'Question deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  app.put('/api/admin/questions/visibility/bulk', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
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
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }
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

  app.put('/api/admin/questions/source/bulk', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      if (scope !== 'all') {
        return res.status(403).json({ error: 'Questions can be managed only from Ednovate admin.' });
      }

      const { ids, source } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array is required' });
      }

      const sanitizedIds = ids.filter((id) => typeof id === 'string' && id.trim().length > 0);
      if (sanitizedIds.length === 0) {
        return res.status(400).json({ error: 'No valid ids provided' });
      }

      const targetSource = String(source || '').trim().toLowerCase() === 'dubey' ? 'dubey' : 'ednovate';
      const result = await pool.query(
        'UPDATE "Question" SET source = $1 WHERE id = ANY($2::text[]) RETURNING *',
        [targetSource, sanitizedIds]
      );

      res.json({ updatedCount: result.rowCount, rows: result.rows, source: targetSource });
    } catch (err: any) {
      console.error('Error bulk updating question source:', err);
      res.status(500).json({ error: 'Failed to update question source' });
    }
  });

  // Settings: question count for test
  app.get('/api/admin/settings', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      const result = await pool.query(
        'SELECT "questionLimit", "ednovateQuestionLimit", "dubeyQuestionLimit", "otpRequired", "ednovateOtpRequired", "dubeyOtpRequired", "ednovateContactNumber", "dubeyContactNumber", "ednovateWhatsappMessage", "dubeyWhatsappMessage", "updatedAt" FROM "AdminSettings" WHERE id = 1'
      );
      const row = result.rows[0] || { questionLimit: 45, otpRequired: true };
      const ednovateQuestionLimit = Number(row.ednovateQuestionLimit ?? row.questionLimit) || 45;
      const dubeyQuestionLimit = Number(row.dubeyQuestionLimit ?? row.questionLimit) || 45;

      const ednovateContactNumber = normalizeContactNumber(row.ednovateContactNumber) || DEFAULT_CONTACT_NUMBER;
      const dubeyContactNumber = normalizeContactNumber(row.dubeyContactNumber) || DEFAULT_CONTACT_NUMBER;
      const ednovateOtpRequired = row.ednovateOtpRequired === undefined ? row.otpRequired !== false : row.ednovateOtpRequired !== false;
      const dubeyOtpRequired = row.dubeyOtpRequired === undefined ? true : row.dubeyOtpRequired !== false;

      res.json({
        questionLimit: scope === 'dubey' ? dubeyQuestionLimit : ednovateQuestionLimit,
        otpRequired: scope === 'dubey' ? dubeyOtpRequired : ednovateOtpRequired,
        scope,
        questionLimits: {
          ednovate: scope === 'all' ? ednovateQuestionLimit : undefined,
          dubey: dubeyQuestionLimit
        },
        otpSettings: {
          ednovate: scope === 'all' ? ednovateOtpRequired : undefined,
          dubey: dubeyOtpRequired
        },
        contactSettings: {
          ednovate: scope === 'all'
            ? {
                contactNumber: ednovateContactNumber,
                whatsappMessage: normalizeWhatsappMessage(row.ednovateWhatsappMessage)
              }
            : undefined,
          dubey: {
            contactNumber: dubeyContactNumber,
            whatsappMessage: normalizeWhatsappMessage(row.dubeyWhatsappMessage)
          }
        },
        updatedAt: row.updatedAt
      });
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/settings', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      const existing = await pool.query(
        'SELECT "questionLimit", "ednovateQuestionLimit", "dubeyQuestionLimit", "otpRequired", "ednovateOtpRequired", "dubeyOtpRequired", "ednovateContactNumber", "dubeyContactNumber", "ednovateWhatsappMessage", "dubeyWhatsappMessage" FROM "AdminSettings" WHERE id = 1'
      );
      const current = existing.rows[0] || {
        questionLimit: 45,
        ednovateQuestionLimit: 45,
        dubeyQuestionLimit: 45,
        otpRequired: true,
        ednovateOtpRequired: true,
        dubeyOtpRequired: true,
        ednovateContactNumber: DEFAULT_CONTACT_NUMBER,
        dubeyContactNumber: DEFAULT_CONTACT_NUMBER,
        ednovateWhatsappMessage: DEFAULT_CTA_MESSAGE,
        dubeyWhatsappMessage: DEFAULT_CTA_MESSAGE
      };

      let nextEdnovateQuestionLimit = Number(current.ednovateQuestionLimit ?? current.questionLimit) || 45;
      let nextDubeyQuestionLimit = Number(current.dubeyQuestionLimit ?? current.questionLimit) || 45;
      const currentEdnovateOtpRequired = current.ednovateOtpRequired === undefined ? (current.otpRequired !== false) : (current.ednovateOtpRequired !== false);
      const currentDubeyOtpRequired = current.dubeyOtpRequired === undefined ? true : (current.dubeyOtpRequired !== false);
      let nextEdnovateOtpRequired = currentEdnovateOtpRequired;
      let nextDubeyOtpRequired = currentDubeyOtpRequired;
      const incomingOtpSettings = req.body?.otpSettings || {};

      if (scope === 'all') {
        const nextEdnovateLimitRaw = req.body?.questionLimit ?? current.ednovateQuestionLimit ?? current.questionLimit;
        const parsedEdnovateLimit = Number(nextEdnovateLimitRaw);
        if (!Number.isInteger(parsedEdnovateLimit) || parsedEdnovateLimit < 1 || parsedEdnovateLimit > 200) {
          return res.status(400).json({ error: 'questionLimit must be an integer between 1 and 200' });
        }
        nextEdnovateQuestionLimit = parsedEdnovateLimit;

        const nextDubeyLimitRaw = req.body?.dubeyQuestionLimit ?? current.dubeyQuestionLimit ?? current.questionLimit;
        const parsedDubeyLimit = Number(nextDubeyLimitRaw);
        if (!Number.isInteger(parsedDubeyLimit) || parsedDubeyLimit < 1 || parsedDubeyLimit > 200) {
          return res.status(400).json({ error: 'dubeyQuestionLimit must be an integer between 1 and 200' });
        }
        nextDubeyQuestionLimit = parsedDubeyLimit;

        nextEdnovateOtpRequired = incomingOtpSettings?.ednovate === undefined
          ? (req.body?.otpRequired === undefined ? currentEdnovateOtpRequired : Boolean(req.body.otpRequired))
          : Boolean(incomingOtpSettings.ednovate);
        nextDubeyOtpRequired = incomingOtpSettings?.dubey === undefined ? currentDubeyOtpRequired : Boolean(incomingOtpSettings.dubey);
      } else {
        const nextDubeyLimitRaw = req.body?.questionLimit ?? current.dubeyQuestionLimit ?? current.questionLimit;
        const parsedDubeyLimit = Number(nextDubeyLimitRaw);
        if (!Number.isInteger(parsedDubeyLimit) || parsedDubeyLimit < 1 || parsedDubeyLimit > 200) {
          return res.status(400).json({ error: 'questionLimit must be an integer between 1 and 200' });
        }
        nextDubeyQuestionLimit = parsedDubeyLimit;
        nextDubeyOtpRequired = incomingOtpSettings?.dubey === undefined
          ? (req.body?.otpRequired === undefined ? currentDubeyOtpRequired : Boolean(req.body.otpRequired))
          : Boolean(incomingOtpSettings.dubey);
      }

      const incomingContactSettings = req.body?.contactSettings || {};
      const resolvedEdnovateNumber = scope === 'all'
        ? (normalizeContactNumber(incomingContactSettings?.ednovate?.contactNumber) || normalizeContactNumber(current.ednovateContactNumber) || DEFAULT_CONTACT_NUMBER)
        : (normalizeContactNumber(current.ednovateContactNumber) || DEFAULT_CONTACT_NUMBER);
      const resolvedDubeyNumber = normalizeContactNumber(incomingContactSettings?.dubey?.contactNumber)
        || normalizeContactNumber(current.dubeyContactNumber)
        || DEFAULT_CONTACT_NUMBER;

      const resolvedEdnovateMessage = scope === 'all'
        ? normalizeWhatsappMessage(incomingContactSettings?.ednovate?.whatsappMessage ?? current.ednovateWhatsappMessage)
        : normalizeWhatsappMessage(current.ednovateWhatsappMessage);
      const resolvedDubeyMessage = normalizeWhatsappMessage(incomingContactSettings?.dubey?.whatsappMessage ?? current.dubeyWhatsappMessage);

      const result = await pool.query(
        `UPDATE "AdminSettings"
         SET "questionLimit" = $1,
             "ednovateQuestionLimit" = $2,
             "dubeyQuestionLimit" = $3,
             "otpRequired" = $4,
             "ednovateOtpRequired" = $5,
             "dubeyOtpRequired" = $6,
             "ednovateContactNumber" = $7,
             "dubeyContactNumber" = $8,
             "ednovateWhatsappMessage" = $9,
             "dubeyWhatsappMessage" = $10,
             "updatedAt" = NOW()
         WHERE id = 1
         RETURNING "questionLimit", "ednovateQuestionLimit", "dubeyQuestionLimit", "otpRequired", "ednovateOtpRequired", "dubeyOtpRequired", "ednovateContactNumber", "dubeyContactNumber", "ednovateWhatsappMessage", "dubeyWhatsappMessage", "updatedAt"`,
        [
          nextEdnovateQuestionLimit,
          nextEdnovateQuestionLimit,
          nextDubeyQuestionLimit,
          true,
          nextEdnovateOtpRequired,
          nextDubeyOtpRequired,
          resolvedEdnovateNumber,
          resolvedDubeyNumber,
          resolvedEdnovateMessage,
          resolvedDubeyMessage
        ]
      );

      const updatedEdnovateQuestionLimit = Number(result.rows[0]?.ednovateQuestionLimit ?? result.rows[0]?.questionLimit) || nextEdnovateQuestionLimit;
      const updatedDubeyQuestionLimit = Number(result.rows[0]?.dubeyQuestionLimit ?? result.rows[0]?.questionLimit) || nextDubeyQuestionLimit;

      const updatedEdnovateOtpRequired = result.rows[0]?.ednovateOtpRequired === undefined
        ? (result.rows[0]?.otpRequired !== false)
        : result.rows[0]?.ednovateOtpRequired !== false;
      const updatedDubeyOtpRequired = result.rows[0]?.dubeyOtpRequired === undefined
        ? true
        : result.rows[0]?.dubeyOtpRequired !== false;

      res.json({
        questionLimit: scope === 'dubey' ? updatedDubeyQuestionLimit : updatedEdnovateQuestionLimit,
        otpRequired: scope === 'dubey' ? updatedDubeyOtpRequired : updatedEdnovateOtpRequired,
        scope,
        questionLimits: {
          ednovate: scope === 'all' ? updatedEdnovateQuestionLimit : undefined,
          dubey: updatedDubeyQuestionLimit
        },
        otpSettings: {
          ednovate: scope === 'all' ? updatedEdnovateOtpRequired : undefined,
          dubey: updatedDubeyOtpRequired
        },
        contactSettings: {
          ednovate: scope === 'all'
            ? {
                contactNumber: normalizeContactNumber(result.rows[0]?.ednovateContactNumber) || DEFAULT_CONTACT_NUMBER,
                whatsappMessage: normalizeWhatsappMessage(result.rows[0]?.ednovateWhatsappMessage)
              }
            : undefined,
          dubey: {
            contactNumber: normalizeContactNumber(result.rows[0]?.dubeyContactNumber) || DEFAULT_CONTACT_NUMBER,
            whatsappMessage: normalizeWhatsappMessage(result.rows[0]?.dubeyWhatsappMessage)
          }
        },
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
      const scope = getAdminScope(req);
      if (scope === 'dubey') {
        await pool.query('DELETE FROM "Student" WHERE id = $1 AND LOWER(TRIM(source)) = $2', [req.params.id, 'dubey']);
      } else {
        await pool.query('DELETE FROM "Student" WHERE id = $1', [req.params.id]);
      }
      res.json({ message: 'Student deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // OTP Verification Data
  app.get('/api/admin/otp-verification', async (req, res) => {
    try {
      const scope = getAdminScope(req);
      const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
      const verifiedScopeClause = scope === 'dubey' ? ' AND LOWER(TRIM(source)) = $1' : '';
      const failedScopeClause = scope === 'dubey' ? ' AND LOWER(TRIM(source)) = $2' : '';
      const failedParams = scope === 'dubey' ? [OTP_MAX_ATTEMPTS, 'dubey'] : [OTP_MAX_ATTEMPTS];

      // Verified users (successfully completed OTP)
      const verifiedResult = await pool.query(
        `
        SELECT 
          mobile,
          "verifiedAt" as "verifiedAt",
          "createdAt" as "otpRequestedAt",
          attempts as "attemptsTaken",
          "correlationId"
        FROM "MobileVerification"
        WHERE "verifiedAt" IS NOT NULL${verifiedScopeClause}
        ORDER BY "verifiedAt" DESC
      `,
        scope === 'dubey' ? ['dubey'] : []
      );

      // Failed/Incomplete attempts (wrong OTP or expired)
      const failedResult = await pool.query(
        `
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
        WHERE "verifiedAt" IS NULL${failedScopeClause}
        ORDER BY "createdAt" DESC
      `,
        failedParams
      );

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
