import { Request, Response } from 'express';
import { pool } from '../config/db';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM instagram_posts ORDER BY sort_order ASC');
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query('SELECT * FROM instagram_posts WHERE id = $1', [req.params.id]);
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { image_url, post_date, caption, instagram_link, sort_order, is_active } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO instagram_posts (image_url, post_date, caption, instagram_link, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [image_url, post_date, caption, instagram_link, sort_order ?? 0, is_active ?? true],
  );
  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const { image_url, post_date, caption, instagram_link, sort_order, is_active } = req.body;
  const { rows } = await pool.query(
    `UPDATE instagram_posts SET image_url=$1, post_date=$2, caption=$3, instagram_link=$4,
     sort_order=$5, is_active=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
    [image_url, post_date, caption, instagram_link, sort_order, is_active, req.params.id],
  );
  if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query('DELETE FROM instagram_posts WHERE id = $1', [req.params.id]);
  if (!rowCount) { res.status(404).json({ error: 'Not found' }); return; }
  res.status(204).send();
}
