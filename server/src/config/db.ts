import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// pg-connection-string warns when it sees 'sslmode=require'; verify-full is
// the equivalent that doesn't trigger the deprecation notice.
const connectionString = (process.env.DATABASE_URL ?? '').replace(
  /sslmode=require\b/g,
  'sslmode=verify-full',
);

export const pool = new Pool({ connectionString });
