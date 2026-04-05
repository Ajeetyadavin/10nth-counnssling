import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  hasConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'true' || process.env.RENDER ? { rejectUnauthorized: false } : undefined
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || 'ajeet',
        password: process.env.DB_PASSWORD || undefined,
        database: process.env.DB_NAME || 'career_care'
      }
);

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

export default pool;
