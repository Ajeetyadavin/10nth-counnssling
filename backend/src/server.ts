import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './db.js';
import { setupAdminRoutes } from './routes/adminRoutes.js';

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

console.log('PostgreSQL Connected');

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Basic API to register student (Initial step)
app.post('/api/student/register', async (req, res) => {
  console.log('Register called:', req.body);
  try {
    const { name, mobile, email, location } = req.body;
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
