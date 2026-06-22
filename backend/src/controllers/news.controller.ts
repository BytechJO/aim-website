import { Request, Response } from "express";
import { pool } from "../config/db";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getUniqueSlug(
  title: string,
  excludeId?: number,
): Promise<string> {
  const baseSlug = generateSlug(title);

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = excludeId
      ? "SELECT id FROM news WHERE slug = $1 AND id != $2 LIMIT 1"
      : "SELECT id FROM news WHERE slug = $1 LIMIT 1";

    const values = excludeId ? [slug, excludeId] : [slug];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM news
    ORDER BY sort_order ASC, created_at DESC
  `);

  res.json(rows);
}

export async function getPublic(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM news
    WHERE is_published = true
    ORDER BY sort_order ASC, created_at DESC
  `);

  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM news
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

export async function getBySlug(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM news
    WHERE slug = $1
      AND is_published = true
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      hero_image,
      thumbnail_image,
      title_color,
      sections,
      is_published,
    } = req.body;

    const finalSlug = slug?.trim() || (await getUniqueSlug(title_en));

    const orderResult = await client.query(`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM news
    `);

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO news (
        slug,
        title_en,
        title_ar,
        description_en,
        description_ar,
        hero_image,
        thumbnail_image,
        title_color,
        sections,
        is_published,
        sort_order
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING *
      `,
      [
        finalSlug,
        title_en,
        title_ar,
        description_en,
        description_ar,
        hero_image,
        thumbnail_image,
        title_color || "#000000",
        JSON.stringify(sections || []),
        is_published ?? false,
        nextSortOrder,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create news error:", error);
    res.status(500).json({ error: "Create failed" });
  } finally {
    client.release();
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    slug,
    title_en,
    title_ar,
    description_en,
    description_ar,
    hero_image,
    thumbnail_image,
    title_color,
    sections,
    is_published,
  } = req.body;

  const finalSlug = slug?.trim()
    ? slug.trim()
    : await getUniqueSlug(title_en, Number(req.params.id));

  const { rows } = await pool.query(
    `
    UPDATE news
    SET
      slug = $1,
      title_en = $2,
      title_ar = $3,
      description_en = $4,
      description_ar = $5,
      hero_image = $6,
      thumbnail_image = $7,
      title_color = $8,
      sections = $9,
      is_published = $10,
      updated_at = NOW()
    WHERE id = $11
    RETURNING *
    `,
    [
      finalSlug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      hero_image,
      thumbnail_image,
      title_color || "#000000",
      JSON.stringify(sections || []),
      is_published ?? false,
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
    `
    DELETE FROM news
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
export async function reorder(req: Request, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    const { ids } = req.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "ids array is required" });
      return;
    }

    await client.query("BEGIN");

    for (let i = 0; i < ids.length; i++) {
      await client.query(
        `
        UPDATE news
        SET sort_order = $1,
            updated_at = NOW()
        WHERE id = $2
        `,
        [i + 1, ids[i]],
      );
    }

    await client.query("COMMIT");

    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
