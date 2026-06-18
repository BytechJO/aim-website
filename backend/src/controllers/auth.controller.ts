import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { signToken } from '../helpers/jwt';

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, full_name, job_number, position } = req.body as {
    email: string;
    password: string;
    full_name: string;
    job_number: string;
    position?: string;
  };

  if (!email || !password || !full_name || !job_number) {
    res.status(400).json({
      error: 'email, password, full_name, and job_number are required',
    });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  // Every new account is an admin awaiting super_admin approval.
  try {
    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, job_number, position, role, approval_status)
       VALUES ($1, $2, $3, $4, $5, 'admin', 'pending')`,
      [email, hash, full_name, job_number, position ?? null],
    );
  } catch (err: unknown) {
    // 23505 = unique_violation (email or job_number already taken)
    if ((err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'Email or job number already registered' });
      return;
    }
    throw err;
  }

  res.status(201).json({
    message: 'Admin account created and awaiting super admin approval',
    approval_status: 'pending',
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const { rows } = await pool.query(
    'SELECT id, email, password_hash, role, approval_status FROM users WHERE email = $1',
    [email],
  );

  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    approval_status: user.approval_status,
  });

  res.json({
    token,
    role: user.role,
    approval_status: user.approval_status,
  });
}
