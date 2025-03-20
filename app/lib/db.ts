// lib/db.ts
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://your_username:your_password@localhost:5432/your_database_name',
  // Remove SSL for local development
  // ssl: {
  //   rejectUnauthorized: false, // For local development; NEVER in production!
  // },
});

export default pool;

export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}
