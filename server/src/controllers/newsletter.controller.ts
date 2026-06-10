import { Request, Response } from 'express';
import { pool } from '../config/db';
import { emit } from '../socket';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM newsletter_subscribers WHERE id = $1', [req.params.id]);
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function subscribe(req: Request, res: Response): Promise<void> {
  const { email, locale } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  const { rows } = await pool.query(
    `INSERT INTO newsletter_subscribers (email, locale)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET locale = EXCLUDED.locale
     RETURNING *`,
    [email, locale ?? 'en'],
  );
  emit('new_subscriber', { email: rows[0].email, locale: rows[0].locale });
  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const { is_confirmed, unsubscribed_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE newsletter_subscribers SET is_confirmed=$1, unsubscribed_at=$2 WHERE id=$3 RETURNING *`,
    [is_confirmed, unsubscribed_at ?? null, req.params.id],
  );
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query('DELETE FROM newsletter_subscribers WHERE id = $1', [req.params.id]);
  if (!rowCount) { res.status(404).json({ error: 'Not found' }); return; }
  res.status(204).send();
}
