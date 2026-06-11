import { Request, Response } from "express";
import { pool } from "../../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT
      t.*,
      c.title_en AS category_title_en,
      c.title_ar AS category_title_ar
    FROM enhancement_types t
    JOIN enhancement_categories c
      ON c.id = t.category_id
    ORDER BY c.sort_order, t.sort_order
  `);

  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM enhancement_types
    WHERE id = $1
    `,
    [req.params.id],
  );

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(rows[0]);
}

export async function create(req: Request, res: Response): Promise<void> {
  const {
    category_id,
    slug,
    title_en,
    title_ar,
    description_en,
    description_ar,
    image_url,
    sort_order,
  } = req.body;

  const { rows } = await pool.query(
    `
    INSERT INTO enhancement_types (
      category_id,
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url,
      sort_order
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      category_id,
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      JSON.stringify(image_url ?? []),
      sort_order ?? 0,
    ],
  );

  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    category_id,
    slug,
    title_en,
    title_ar,
    description_en,
    description_ar,
    image_url,
    sort_order,
  } = req.body;

  const { rows } = await pool.query(
    `
    UPDATE enhancement_types
    SET
      category_id = $1,
      slug = $2,
      title_en = $3,
      title_ar = $4,
      description_en = $5,
      description_ar = $6,
      image_url = $7,
      sort_order = $8
    WHERE id = $9
    RETURNING *
    `,
    [
      category_id,
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      JSON.stringify(image_url ?? []),
      sort_order ?? 0,
      req.params.id,
    ],
  );

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query(
    "DELETE FROM enhancement_types WHERE id = $1",
    [req.params.id],
  );

  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
}
