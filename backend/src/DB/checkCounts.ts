import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../config/db';

async function main() {
  const tables = ['service_categories','products','reviews','instagram_posts','contact_inquiries','newsletter_subscribers'];
  for (const t of tables) {
    const { rows } = await pool.query(`SELECT COUNT(*) FROM ${t}`);
    console.log(`${t}: ${rows[0].count}`);
  }
  await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
