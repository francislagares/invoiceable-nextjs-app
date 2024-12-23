import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { Customer, Invoice } from '@/drizzle/schema';

let pool: Pool;

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : undefined,
    });

    // Error handling
    pool.on('error', err => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  return pool;
}

export const db = drizzle(getPool(), {
  schema: {
    Invoice,
    Customer,
  },
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing pool...');
  try {
    await pool?.end();
    console.log('Pool has ended');
    process.exit(0);
  } catch (err) {
    console.error('Error during pool shutdown:', err);
    process.exit(1);
  }
});
