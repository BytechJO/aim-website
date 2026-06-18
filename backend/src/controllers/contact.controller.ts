import { Request, Response } from 'express';
import { pool } from '../config/db';
import { emit } from '../socket';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM contact_inquiries WHERE id = $1', [req.params.id]);
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, email, phone, message, inquiry_type } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'name, email, and message are required' });
    return;
  }
  const { rows } = await pool.query(
    `INSERT INTO contact_inquiries (name, email, phone, message, inquiry_type)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, phone ?? null, message, inquiry_type ?? 'general'],
  );
  emit('new_contact', { name: rows[0].name, email: rows[0].email, inquiry_type: rows[0].inquiry_type });
  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE contact_inquiries SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, req.params.id],
  );
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query('DELETE FROM contact_inquiries WHERE id = $1', [req.params.id]);
  if (!rowCount) { res.status(404).json({ error: 'Not found' }); return; }
  res.status(204).send();
}
