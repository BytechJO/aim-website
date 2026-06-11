import { Request, Response } from "express";
import { pool } from "../../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT
      c.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.id,
            'slug', t.slug,
            'title_en', t.title_en,
            'title_ar', t.title_ar,
            'description_en', t.description_en,
            'description_ar', t.description_ar,
            'images', t.image_url,
            'sort_order', t.sort_order
          )
          ORDER BY t.sort_order
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS types
    FROM enhancement_categories c
    LEFT JOIN enhancement_types t
      ON t.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order;
  `);

  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT
      c.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.id,
            'slug', t.slug,
            'title_en', t.title_en,
            'title_ar', t.title_ar,
            'description_en', t.description_en,
            'description_ar', t.description_ar,
            'images', t.image_url,
            'sort_order', t.sort_order
          )
          ORDER BY t.sort_order
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS types
    FROM enhancement_categories c
    LEFT JOIN enhancement_types t
      ON t.category_id = c.id
    WHERE c.slug = $1
    GROUP BY c.id
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
    sort_order,
  } = req.body;

  const generatedSlug =
    slug || title_en.toLowerCase().trim().replace(/\s+/g, "-");

  const { rows } = await pool.query(
    `
    INSERT INTO enhancement_categories (
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      sort_order
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      generatedSlug,
      title_en,
      title_ar,
      description_en,
      description_ar,
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
    sort_order,
  } = req.body;

  const { rows } = await pool.query(
    `
    UPDATE enhancement_categories
    SET
      slug = $1,
      title_en = $2,
      title_ar = $3,
      description_en = $4,
      description_ar = $5,
      sort_order = $6
    WHERE id = $7
    RETURNING *
    `,
    [
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      sort_order,
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
    "DELETE FROM enhancement_categories WHERE id = $1",
    [req.params.id],
  );

  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
}
