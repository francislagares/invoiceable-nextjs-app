import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Connection configuration for cloud database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false, // Required for some cloud providers
  },
});

// Add error listener
pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export configured database client
export const db = drizzle(pool, {
  logger: process.env.NODE_ENV === 'development',
});

// Verify database connection
export async function testConnection() {
  try {
    const client = await pool.connect();

    await client.query('SELECT NOW()');

    client.release();
    console.log('Database connection successful');

    return true;
  } catch (error) {
    console.error('Database connection failed:', error);

    return false;
  }
}
