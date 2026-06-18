import { Request, Response } from 'express';
import { pool } from '../config/db';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM reviews ORDER BY sort_order ASC');
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM reviews WHERE id = $1', [req.params.id]);
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { title, body, author, rating, sort_order, is_active } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO reviews (title, body, author, rating, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, body, author, rating ?? 5, sort_order ?? 0, is_active ?? true],
  );
  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const { title, body, author, rating, sort_order, is_active } = req.body;
  const { rows } = await pool.query(
    `UPDATE reviews SET title=$1, body=$2, author=$3, rating=$4, sort_order=$5, is_active=$6, updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [title, body, author, rating, sort_order, is_active, req.params.id],
  );
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
  if (!rowCount) { res.status(404).json({ error: 'Not found' }); return; }
  res.status(204).send();
}
