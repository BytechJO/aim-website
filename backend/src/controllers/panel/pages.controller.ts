import { Request, Response } from "express";
import { pool } from "../../config/db";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM pages
    ORDER BY created_at DESC, id DESC;
  `);

  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM pages
    WHERE slug = $1
    LIMIT 1
    `,
    [req.params.slug],
  );

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const page = rows[0];

  const sectionsResult = await pool.query(
    `
    SELECT *
    FROM page_sections
    WHERE page_id = $1
    AND is_active = true
    ORDER BY sort_order ASC, id ASC
    `,
    [page.id],
  );

  res.json({
    ...page,
    sections: sectionsResult.rows,
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const {
      slug,
      title_en,
      title_ar,
      meta_title_en,
      meta_title_ar,
      meta_description_en,
      meta_description_ar,
      is_published,
    } = req.body;

    if (!title_en || !title_ar) {
      res.status(400).json({ error: "title_en and title_ar are required" });
      return;
    }

    const generatedSlug = slug?.trim() || generateSlug(title_en);

    const { rows } = await pool.query(
      `
      INSERT INTO pages (
        slug,
        title_en,
        title_ar,
        meta_title_en,
        meta_title_ar,
        meta_description_en,
        meta_description_ar,
        is_published
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        generatedSlug,
        title_en,
        title_ar,
        meta_title_en || null,
        meta_title_ar || null,
        meta_description_en || null,
        meta_description_ar || null,
        is_published ?? true,
      ],
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error("Create page error:", error);

    if (error.code === "23505") {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }

    res.status(500).json({ error: "Create failed" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const {
      slug,
      title_en,
      title_ar,
      meta_title_en,
      meta_title_ar,
      meta_description_en,
      meta_description_ar,
      is_published,
    } = req.body;

    if (!title_en || !title_ar) {
      res.status(400).json({ error: "title_en and title_ar are required" });
      return;
    }

    const generatedSlug = slug?.trim() || generateSlug(title_en);

    const { rows } = await pool.query(
      `
      UPDATE pages
      SET
        slug = $1,
        title_en = $2,
        title_ar = $3,
        meta_title_en = $4,
        meta_title_ar = $5,
        meta_description_en = $6,
        meta_description_ar = $7,
        is_published = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
      `,
      [
        generatedSlug,
        title_en,
        title_ar,
        meta_title_en || null,
        meta_title_ar || null,
        meta_description_en || null,
        meta_description_ar || null,
        is_published ?? true,
        req.params.id,
      ],
    );

    if (!rows[0]) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error("Update page error:", error);

    if (error.code === "23505") {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }

    res.status(500).json({ error: "Update failed" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query(
    `
    DELETE FROM pages
    WHERE id = $1
    `,
    [req.params.id],
  );

  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
}
