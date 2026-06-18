import { Request, Response } from 'express';
import { pool } from '../config/db';

const PUBLIC_COLUMNS =
  'id, email, full_name, job_number, position, role, approval_status, created_at, updated_at';

async function countOtherSuperAdmins(excludeId: number): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM users WHERE role = 'super_admin' AND id <> $1`,
    [excludeId],
  );
  return rows[0].count;
}

/** List all staff accounts. Optional ?status=pending|approved|rejected filter. */
export async function getAll(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: string };
  const allowed = ['pending', 'approved', 'rejected'];

  if (status && allowed.includes(status)) {
    const { rows } = await pool.query(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE approval_status = $1 ORDER BY created_at DESC`,
      [status],
    );
    res.json(rows);
    return;
  }

  const { rows } = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY created_at DESC`,
  );
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`,
    [req.params.id],
  );
  if (!rows[0]) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(rows[0]);
}

/** Approve or reject a pending admin registration. */
export async function setApproval(req: Request, res: Response): Promise<void> {
  const { approval_status } = req.body as { approval_status?: string };

  if (approval_status !== 'approved' && approval_status !== 'rejected') {
    res.status(400).json({ error: "approval_status must be 'approved' or 'rejected'" });
    return;
  }

  const { rows } = await pool.query(
    `UPDATE users SET approval_status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [approval_status, req.params.id],
  );
  if (!rows[0]) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(rows[0]);
}

/** Promote an admin to super_admin, or demote a super_admin to admin. */
export async function setRole(req: Request, res: Response): Promise<void> {
  const { role } = req.body as { role?: string };

  if (role !== 'admin' && role !== 'super_admin') {
    res.status(400).json({ error: "role must be 'admin' or 'super_admin'" });
    return;
  }

  const id = Number(req.params.id);

  // Guard: never demote the last remaining super_admin.
  if (role === 'admin' && (await countOtherSuperAdmins(id)) === 0) {
    const { rows } = await pool.query(
      `SELECT role FROM users WHERE id = $1`,
      [id],
    );
    if (rows[0]?.role === 'super_admin') {
      res.status(409).json({ error: 'Cannot demote the last remaining super_admin' });
      return;
    }
  }

  // Promotion implies the account is active.
  const approvalClause = role === 'super_admin' ? ", approval_status = 'approved'" : '';

  const { rows } = await pool.query(
    `UPDATE users SET role = $1${approvalClause}, updated_at = NOW()
     WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [role, id],
  );
  if (!rows[0]) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
  if (!rows[0]) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  // Guard: never delete the last remaining super_admin.
  if (rows[0].role === 'super_admin' && (await countOtherSuperAdmins(id)) === 0) {
    res.status(409).json({ error: 'Cannot delete the last remaining super_admin' });
    return;
  }

  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.status(204).send();
}
