import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { Role, ApprovalStatus } from '../helpers/jwt';

interface CurrentUser {
  role: Role;
  approval_status: ApprovalStatus;
}

// Read the account's current role + approval_status from the DB so a stale
// token (e.g. issued before approval, or after a later rejection/demotion)
// cannot grant access it no longer deserves.
async function loadCurrentUser(id: number): Promise<CurrentUser | null> {
  const { rows } = await pool.query(
    'SELECT role, approval_status FROM users WHERE id = $1',
    [id],
  );
  return rows[0] ?? null;
}

/** Approved admin OR super_admin. */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized — token required' });
    return;
  }

  const user = await loadCurrentUser(req.user.id);
  if (!user) {
    res.status(401).json({ error: 'Account no longer exists' });
    return;
  }

  const isApprovedAdmin = user.role === 'admin' && user.approval_status === 'approved';
  if (isApprovedAdmin || user.role === 'super_admin') {
    next();
    return;
  }

  res.status(403).json({ error: 'Forbidden — approved admin access required' });
}

/** super_admin only. */
export async function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized — token required' });
    return;
  }

  const user = await loadCurrentUser(req.user.id);
  if (!user) {
    res.status(401).json({ error: 'Account no longer exists' });
    return;
  }

  if (user.role === 'super_admin') {
    next();
    return;
  }

  res.status(403).json({ error: 'Forbidden — super admin access required' });
}
