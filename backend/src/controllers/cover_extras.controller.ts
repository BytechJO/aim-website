import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM cover_extras
    ORDER BY sort_order, id;
  `);

  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM cover_extras
    WHERE slug = $1
    LIMIT 1
    `,
    [req.params.slug],
  );

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(rows[0]);
}

export async function create(req: Request, res: Response): Promise<void> {
  const {
    slug,
    title_en,
    title_ar,
    description_en,
    description_ar,
    image_url,
    sort_order,
  } = req.body;

  const generatedSlug =
    slug || title_en.toLowerCase().trim().replace(/\s+/g, "-");

  const { rows } = await pool.query(
    `
    INSERT INTO cover_extras (
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url,
      sort_order
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      generatedSlug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url || [],
      sort_order ?? 0,
    ],
  );

  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    slug,
    title_en,
    title_ar,
    description_en,
    description_ar,
    image_url,
    sort_order,
    is_active,
  } = req.body;
 const generatedSlug =
    slug || title_en.toLowerCase().trim().replace(/\s+/g, "-");

  const { rows } = await pool.query(
    `
    UPDATE cover_extras
    SET
      slug = $1,
      title_en = $2,
      title_ar = $3,
      description_en = $4,
      description_ar = $5,
      image_url = $6,
      sort_order = $7,
      is_active = $8
    WHERE id = $9
    RETURNING *
    `,
    [
      generatedSlug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url,
      sort_order,
      is_active,
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
    "DELETE FROM cover_extras WHERE id = $1",
    [req.params.id],
  );

  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
}
