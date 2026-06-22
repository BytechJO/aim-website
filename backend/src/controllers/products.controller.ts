import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM products ORDER BY sort_order ASC",
  );
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query("SELECT * FROM products WHERE slug = $1", [
    req.params.slug,
  ]);

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
      subtitle_en,
      subtitle_ar,
      image_url,
      is_active,
      description_en,
      description_ar,
      best_use_en,
      best_use_ar,
      eco_friendly_en,
      eco_friendly_ar,
      model_3d,
      find_out_more_images,
      example_images,
      format_min_en,
      format_min_ar,
      format_max_en,
      format_max_ar,
      thickness_min_en,
      thickness_min_ar,
      thickness_max_en,
      thickness_max_ar,
      materials_en,
      materials_ar,
      extras_en,
      extras_ar,
      enhancements_en,
      enhancements_ar,
    } = req.body;

    if (!title_en?.trim()) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (!image_url?.trim()) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Main image is required" });
      return;
    }

    const orderResult = await client.query(`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM products
    `);

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO products (
        slug,
        title_en,
        title_ar,
        subtitle_en,
        subtitle_ar,
        image_url,
        sort_order,
        is_active,
        description_en,
        description_ar,
        best_use_en,
        best_use_ar,
        eco_friendly_en,
        eco_friendly_ar,
        model_3d,
        find_out_more_images,
        example_images,
        format_min_en,
        format_min_ar,
        format_max_en,
        format_max_ar,
        thickness_min_en,
        thickness_min_ar,
        thickness_max_en,
        thickness_max_ar,
        materials_en,
        materials_ar,
        extras_en,
        extras_ar,
        enhancements_en,
        enhancements_ar
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,$25,
        $26,$27,$28,$29,$30,$31
      )
      RETURNING *
      `,
      [
        slug,
        title_en,
        title_ar,
        subtitle_en ?? null,
        subtitle_ar ?? null,
        image_url,
        nextSortOrder,
        is_active ?? true,
        description_en ?? null,
        description_ar ?? null,
        best_use_en ?? null,
        best_use_ar ?? null,
        eco_friendly_en ?? null,
        eco_friendly_ar ?? null,
        model_3d ?? null,
        JSON.stringify(find_out_more_images ?? []),
        JSON.stringify(example_images ?? []),
        format_min_en ?? null,
        format_min_ar ?? null,
        format_max_en ?? null,
        format_max_ar ?? null,
        thickness_min_en ?? null,
        thickness_min_ar ?? null,
        thickness_max_en ?? null,
        thickness_max_ar ?? null,
        materials_en ?? null,
        materials_ar ?? null,
        extras_en ?? null,
        extras_ar ?? null,
        enhancements_en ?? null,
        enhancements_ar ?? null,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create product error:", error);
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
    subtitle_en,
    subtitle_ar,
    image_url,
    is_active,
    description_en,
    description_ar,
    best_use_en,
    best_use_ar,
    eco_friendly_en,
    eco_friendly_ar,
    model_3d,
    find_out_more_images,
    example_images,
    format_min_en,
    format_min_ar,
    format_max_en,
    format_max_ar,
    thickness_min_en,
    thickness_min_ar,
    thickness_max_en,
    thickness_max_ar,
    materials_en,
    materials_ar,
    extras_en,
    extras_ar,
    enhancements_en,
    enhancements_ar,
  } = req.body;

  if (!title_en?.trim()) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  if (!image_url?.trim()) {
    res.status(400).json({ error: "Main image is required" });
    return;
  }

  const { rows } = await pool.query(
    `
    UPDATE products
    SET
      slug = $1,
      title_en = $2,
      title_ar = $3,
      subtitle_en = $4,
      subtitle_ar = $5,
      image_url = $6,
      is_active = $7,
      description_en = $8,
      description_ar = $9,
      best_use_en = $10,
      best_use_ar = $11,
      eco_friendly_en = $12,
      eco_friendly_ar = $13,
      model_3d = $14,
      find_out_more_images = $15,
      example_images = $16,
      format_min_en = $17,
      format_min_ar = $18,
      format_max_en = $19,
      format_max_ar = $20,
      thickness_min_en = $21,
      thickness_min_ar = $22,
      thickness_max_en = $23,
      thickness_max_ar = $24,
      materials_en = $25,
      materials_ar = $26,
      extras_en = $27,
      extras_ar = $28,
      enhancements_en = $29,
      enhancements_ar = $30,
      updated_at = NOW()
    WHERE id = $31
    RETURNING *
    `,
    [
      slug,
      title_en,
      title_ar,
      subtitle_en ?? null,
      subtitle_ar ?? null,
      image_url,
      is_active ?? true,
      description_en ?? null,
      description_ar ?? null,
      best_use_en ?? null,
      best_use_ar ?? null,
      eco_friendly_en ?? null,
      eco_friendly_ar ?? null,
      model_3d ?? null,
      JSON.stringify(find_out_more_images ?? []),
      JSON.stringify(example_images ?? []),
      format_min_en ?? null,
      format_min_ar ?? null,
      format_max_en ?? null,
      format_max_ar ?? null,
      thickness_min_en ?? null,
      thickness_min_ar ?? null,
      thickness_max_en ?? null,
      thickness_max_ar ?? null,
      materials_en ?? null,
      materials_ar ?? null,
      extras_en ?? null,
      extras_ar ?? null,
      enhancements_en ?? null,
      enhancements_ar ?? null,
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
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [
    req.params.id,
  ]);

  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json({
    success: true,
  });
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

    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE products
        SET sort_order = $1,
            updated_at = NOW()
        WHERE id = $2
        `,
        [-(i + 1), cleanIds[i]],
      );
    }

    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE products
        SET sort_order = $1,
            updated_at = NOW()
        WHERE id = $2
        `,
        [i + 1, cleanIds[i]],
      );
    }

    await client.query("COMMIT");

    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Products reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
