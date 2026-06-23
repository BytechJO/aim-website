import { Request, Response } from "express";
import { pool } from "../../config/db";

export async function getByPage(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM page_sections
    WHERE page_id = $1
    ORDER BY sort_order ASC, id ASC
    `,
    [req.params.pageId],
  );

  res.json(rows);
}

export async function create(req: Request, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      section_type,

      title_en,
      title_ar,

      subtitle_en,
      subtitle_ar,

      description_en,
      description_ar,

      image_url,

      cta_label_en,
      cta_label_ar,
      cta_url,

      content,
      styles,

      is_active,
    } = req.body;

    if (!section_type) {
      res.status(400).json({ error: "section_type is required" });
      return;
    }

    const orderResult = await client.query(
      `
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM page_sections
      WHERE page_id = $1
      `,
      [req.params.pageId],
    );

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO page_sections (
        page_id,
        section_type,

        title_en,
        title_ar,

        subtitle_en,
        subtitle_ar,

        description_en,
        description_ar,

        image_url,

        cta_label_en,
        cta_label_ar,
        cta_url,

        content,
        styles,

        sort_order,
        is_active
      )
      VALUES (
        $1,$2,
        $3,$4,
        $5,$6,
        $7,$8,
        $9,
        $10,$11,$12,
        $13,$14,
        $15,$16
      )
      RETURNING *
      `,
      [
        req.params.pageId,
        section_type,

        title_en || null,
        title_ar || null,

        subtitle_en || null,
        subtitle_ar || null,

        description_en || null,
        description_ar || null,

        image_url || null,

        cta_label_en || null,
        cta_label_ar || null,
        cta_url || null,

        content || {},
        styles || {},

        nextSortOrder,
        is_active ?? true,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create page section error:", error);
    res.status(500).json({ error: "Create failed" });
  } finally {
    client.release();
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    section_type,

    title_en,
    title_ar,

    subtitle_en,
    subtitle_ar,

    description_en,
    description_ar,

    image_url,

    cta_label_en,
    cta_label_ar,
    cta_url,

    content,
    styles,

    is_active,
  } = req.body;

  if (!section_type) {
    res.status(400).json({ error: "section_type is required" });
    return;
  }

  const { rows } = await pool.query(
    `
    UPDATE page_sections
    SET
      section_type = $1,

      title_en = $2,
      title_ar = $3,

      subtitle_en = $4,
      subtitle_ar = $5,

      description_en = $6,
      description_ar = $7,

      image_url = $8,

      cta_label_en = $9,
      cta_label_ar = $10,
      cta_url = $11,

      content = $12,
      styles = $13,

      is_active = $14,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $15
    RETURNING *
    `,
    [
      section_type,

      title_en || null,
      title_ar || null,

      subtitle_en || null,
      subtitle_ar || null,

      description_en || null,
      description_ar || null,

      image_url || null,

      cta_label_en || null,
      cta_label_ar || null,
      cta_url || null,

      content || {},
      styles || {},

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
    `
    DELETE FROM page_sections
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

    const cleanIds = ids.map(Number).filter((id) => Number.isInteger(id));

    if (cleanIds.length !== ids.length) {
      res.status(400).json({ error: "ids must be numbers" });
      return;
    }

    await client.query("BEGIN");

    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE page_sections
        SET sort_order = $1
        WHERE id = $2
        `,
        [-(i + 1), cleanIds[i]],
      );
    }

    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE page_sections
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
    console.error("Page sections reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
