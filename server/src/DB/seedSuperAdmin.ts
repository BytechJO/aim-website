import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

/**
 * Guarantees at least one super_admin exists.
 *
 * Reads credentials from environment variables and creates an approved
 * super_admin if (and only if) no super_admin is present yet. Idempotent:
 * once a super_admin exists this is a no-op, so it is safe to run on every boot.
 *
 * Required env vars (only used on first seed):
 *   SUPER_ADMIN_EMAIL
 *   SUPER_ADMIN_PASSWORD
 *   SUPER_ADMIN_FULL_NAME
 *   SUPER_ADMIN_JOB_NUMBER
 *   SUPER_ADMIN_POSITION   (optional)
 */
export async function seedSuperAdmin(): Promise<void> {
  const { rows } = await pool.query(
    `SELECT 1 FROM users WHERE role = 'super_admin' LIMIT 1`,
  );
  if (rows.length > 0) {
    return; // a super_admin already exists
  }

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const fullName = process.env.SUPER_ADMIN_FULL_NAME;
  const jobNumber = process.env.SUPER_ADMIN_JOB_NUMBER;
  const position = process.env.SUPER_ADMIN_POSITION ?? null;

  if (!email || !password || !fullName || !jobNumber) {
    return; // env vars not set — skip silently
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, job_number, position, role, approval_status)
     VALUES ($1, $2, $3, $4, $5, 'super_admin', 'approved')
     ON CONFLICT (email) DO NOTHING`,
    [email, hash, fullName, jobNumber, position],
  );

  console.log(`Seeded initial super_admin: ${email}`);
}
