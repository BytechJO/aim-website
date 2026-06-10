import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

export async function initDB(): Promise<void> {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Database tables ready');
}
