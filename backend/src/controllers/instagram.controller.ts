import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM instagram_posts ORDER BY sort_order ASC",
  );
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM instagram_posts WHERE id = $1",
    [req.params.id],
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

    const { image_url, post_date, caption, instagram_link, is_active } =
      req.body;

    const finalPostDate =
      post_date && post_date.trim() !== ""
        ? post_date
        : new Date().toISOString().split("T")[0];

    const orderResult = await client.query(`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM instagram_posts
    `);

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO instagram_posts (
        image_url,
        post_date,
        caption,
        instagram_link,
        sort_order,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        image_url,
        finalPostDate,
        caption,
        instagram_link,
        nextSortOrder,
        is_active ?? true,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create instagram error:", error);
    res.status(500).json({ error: "Create failed" });
  } finally {
    client.release();
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { image_url, post_date, caption, instagram_link, is_active } = req.body;

  const finalPostDate =
    post_date && post_date.trim() !== ""
      ? post_date
      : new Date().toISOString().split("T")[0];

  const { rows } = await pool.query(
    `
    UPDATE instagram_posts
    SET
      image_url = $1,
      post_date = $2,
      caption = $3,
      instagram_link = $4,
      is_active = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [
      image_url,
      finalPostDate,
      caption,
      instagram_link,
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
    "DELETE FROM instagram_posts WHERE id = $1",
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
        UPDATE instagram_posts
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
        UPDATE instagram_posts
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
    console.error("Instagram reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
