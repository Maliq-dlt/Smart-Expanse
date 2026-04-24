import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

// Log a safe version of the URL to ensure it's loaded correctly (hiding password)
const safeUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
console.log('🔗 Init DB with URL:', safeUrl);

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
