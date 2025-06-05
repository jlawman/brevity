import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a new pool
const pool = new Pool({ connectionString });

// Create drizzle instance
export const db = drizzle({ client: pool, schema });

// Export schema for easy access
export * from './schema';