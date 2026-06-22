import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM reviews ORDER BY sort_order ASC",
  );
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query("SELECT * FROM reviews WHERE id = $1", [
    req.params.id,
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

    const { title, body, author, rating, is_active } = req.body;

    const orderResult = await client.query(`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM reviews
    `);

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO reviews (
        title,
        body,
        author,
        rating,
        sort_order,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [title, body, author, rating ?? 5, nextSortOrder, is_active ?? true],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create review error:", error);
    res.status(500).json({ error: "Create failed" });
  } finally {
    client.release();
  }
}
export async function update(req: Request, res: Response): Promise<void> {
  const { title, body, author, rating, is_active } = req.body;

  const { rows } = await pool.query(
    `
    UPDATE reviews
    SET
      title = $1,
      body = $2,
      author = $3,
      rating = $4,
      is_active = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [title, body, author, rating ?? 5, is_active ?? true, req.params.id],
  );

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query("DELETE FROM reviews WHERE id = $1", [
    req.params.id,
  ]);
  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
}

export async function getLatest(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM reviews
    WHERE is_active = true
    ORDER BY sort_order ASC
    LIMIT 7
    `,
  );

  res.json(rows);
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
        UPDATE reviews
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
        UPDATE reviews
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
    console.error("Reviews reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
