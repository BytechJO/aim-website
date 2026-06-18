import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

const users = [
  {
    email: 'superadmin@aim.com',
    password: 'SuperAdmin@2025',
    full_name: 'Super Admin',
    job_number: 'SA-001',
    position: 'Super Administrator',
    role: 'super_admin',
    approval_status: 'approved',
  },
  {
    email: 'admin@aim.com',
    password: 'Admin@2025',
    full_name: 'Admin User',
    job_number: 'A-001',
    position: 'Administrator',
    role: 'admin',
    approval_status: 'approved',
  },
];

async function seed(): Promise<void> {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, job_number, position, role, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [u.email, hash, u.full_name, u.job_number, u.position, u.role, u.approval_status],
    );
    console.log(`Inserted: ${u.role} — ${u.email}`);
  }
  await pool.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
