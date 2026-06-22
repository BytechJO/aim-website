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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      slug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url,
      is_active,
    } = req.body;

    const generatedSlug =
      slug?.trim() || title_en.toLowerCase().trim().replace(/\s+/g, "-");

    const orderResult = await client.query(`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM cover_extras
    `);

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO cover_extras (
        slug,
        title_en,
        title_ar,
        description_en,
        description_ar,
        image_url,
        sort_order,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        generatedSlug,
        title_en,
        title_ar,
        description_en,
        description_ar,
        image_url || [],
        nextSortOrder,
        is_active ?? true,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create cover extra error:", error);
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
    image_url,
    is_active,
  } = req.body;

  const generatedSlug =
    slug?.trim() || title_en.toLowerCase().trim().replace(/\s+/g, "-");

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
      is_active = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      generatedSlug,
      title_en,
      title_ar,
      description_en,
      description_ar,
      image_url || [],
      is_active ?? true,
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
export async function reorder(req: Request, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    const { ids } = req.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "ids array is required" });
      return;
    }

    const cleanIds = ids.map(Number).filter((id) => Number.isInteger(id));

    if (cleanIds.length !== ids.length) {
      res.status(400).json({ error: "ids must be numbers" });
      return;
    }

    await client.query("BEGIN");

    // قيم مؤقتة عشان نتجنب أي تضارب بالترتيب
    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE cover_extras
        SET sort_order = $1
        WHERE id = $2
        `,
        [-(i + 1), cleanIds[i]],
      );
    }

    // الترتيب النهائي
    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE cover_extras
        SET sort_order = $1
        WHERE id = $2
        `,
        [i + 1, cleanIds[i]],
      );
    }

    await client.query("COMMIT");

    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cover extras reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
