import pool from '../db.js';
import { generateReportPDF } from '../utils/pdfGenerator.js';
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
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // AdminSettings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "AdminSettings" (
      id INT PRIMARY KEY,
      "questionLimit" INT NOT NULL DEFAULT 45,
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    INSERT INTO "AdminSettings" (id, "questionLimit", "updatedAt")
    VALUES (1, 45, NOW())
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
  ensureTables().catch((err) => console.error('Failed to initialize tables:', err));

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
  app.get('/api/admin/report/generate', async (req, res) => {
    try {
      const { mobile } = req.query;
      if (!mobile) return res.status(400).send('Mobile number is required');

      const result = await pool.query('SELECT * FROM "Student" WHERE mobile = $1 ORDER BY "createdAt" DESC LIMIT 1', [mobile]);
      const student = result.rows[0];
      
      if (!student) return res.status(404).send('No completed test found for this mobile number');
      if (student.status !== 'Completed' || !student.result) return res.status(403).send('Test not completed yet');
      
      const pdfBuffer = await generateReportPDF(student);
      res.contentType('application/pdf');
      res.attachment(`Report_${student.name}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Error generating report:', err);
    }
  });

  // Questions Management
  app.get('/api/admin/questions', async (req, res) => {
    try {
      console.log('Fetching questions from PostgreSQL...');
      const includeHidden = req.query.includeHidden === '1' || req.query.includeHidden === 'true';
      const query = includeHidden
        ? 'SELECT * FROM "Question" ORDER BY "order" ASC, "createdAt" DESC'
        : 'SELECT * FROM "Question" WHERE "hidden" = FALSE ORDER BY "order" ASC, "createdAt" DESC';
      const result = await pool.query(query);
      console.log('Found questions:', result.rows.length);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.post('/api/admin/questions', async (req, res) => {
    try {
      const { text, options, category, hidden } = req.body;
      console.log('Adding new question:', text);
      const result = await pool.query(
        'INSERT INTO "Question" (text, options, category, hidden) VALUES ($1, $2, $3, $4) RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden)]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      console.error('Error adding question:', err);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  app.put('/api/admin/questions/:id', async (req, res) => {
    try {
      const { text, options, category, hidden } = req.body;
      console.log('Updating question:', req.params.id);
      const result = await pool.query(
        'UPDATE "Question" SET text = $1, options = $2, category = $3, hidden = $4 WHERE id = $5 RETURNING *',
        [text, JSON.stringify(options), category, Boolean(hidden), req.params.id]
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
        'UPDATE "Question" SET hidden = $1 WHERE id = ANY($2::uuid[]) RETURNING *',
        [Boolean(hidden), sanitizedIds]
      );

      res.json({ updatedCount: result.rowCount, rows: result.rows });
    } catch (err: any) {
      console.error('Error bulk updating question visibility:', err);
      res.status(500).json({ error: 'Failed to update visibility' });
    }
  });

  // Settings: question count for test
  app.get('/api/admin/settings', async (_req, res) => {
    try {
      const result = await pool.query('SELECT "questionLimit", "updatedAt" FROM "AdminSettings" WHERE id = 1');
      const row = result.rows[0] || { questionLimit: 45 };
      res.json({ questionLimit: row.questionLimit, updatedAt: row.updatedAt });
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/settings', async (req, res) => {
    try {
      const rawLimit = Number(req.body?.questionLimit);
      if (!Number.isInteger(rawLimit) || rawLimit < 1 || rawLimit > 200) {
        return res.status(400).json({ error: 'questionLimit must be an integer between 1 and 200' });
      }
      const result = await pool.query(
        `UPDATE "AdminSettings"
         SET "questionLimit" = $1, "updatedAt" = NOW()
         WHERE id = 1
         RETURNING "questionLimit", "updatedAt"`,
        [rawLimit]
      );

      res.json(result.rows[0]);
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
};
