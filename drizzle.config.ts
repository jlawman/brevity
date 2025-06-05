import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;