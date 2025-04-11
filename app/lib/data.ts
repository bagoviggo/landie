import { Pool } from 'pg';

// Use this as createPool for compatibility with the rest of your code
const createPool = (config: any) => new Pool(config);
import { Revenue } from './types';
// Configure local database connection
// These can also be set as environment variables
const localDbConfig = {
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 5, // Maximum number of clients in the pool
  connectionTimeoutMillis: 10000, // Connection timeout
};

// Log connection info for debugging (remove in production)
console.log('Database connection string exists:', !!process.env.POSTGRES_URL);

// Create a custom pool for local development
const db = createPool(localDbConfig);
export async function fetchRevenue() {
  try {
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection string not provided');
      return [];
    }
    
    // Check if table exists first
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'revenue'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('Table "revenue" does not exist in the database');
      return [];
    }
    
    const data = await db.query<Revenue>('SELECT * FROM revenue');
    console.log('Revenue data fetched:', data.rows.length, 'rows');
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

