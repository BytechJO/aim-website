import { Request, Response } from "express";
import { pool } from "../../config/db";

export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM navigation_links
    ORDER BY sort_order ASC, id ASC;
  `);

  res.json(rows);
}

export async function getTree(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(`
    SELECT *
    FROM navigation_links
    WHERE is_active = true
    ORDER BY sort_order ASC, id ASC;
  `);

  const parents = rows.filter((item) => item.parent_id === null);
  const children = rows.filter((item) => item.parent_id !== null);

  const tree = parents.map((parent) => ({
    ...parent,
    children: children.filter((child) => child.parent_id === parent.id),
  }));

  res.json(tree);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM navigation_links
    WHERE id = $1
    LIMIT 1
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { label_en, label_ar, href, parent_id, is_active, open_in_new_tab } =
      req.body;

    if (!label_en || !label_ar || !href) {
      res.status(400).json({
        error: "label_en, label_ar and href are required",
      });
      return;
    }

    const orderResult = await client.query(
      `
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
      FROM navigation_links
      WHERE parent_id IS NOT DISTINCT FROM $1
      `,
      [parent_id || null],
    );

    const nextSortOrder = Number(orderResult.rows[0].next_sort_order);

    const { rows } = await client.query(
      `
      INSERT INTO navigation_links (
        label_en,
        label_ar,
        href,
        parent_id,
        sort_order,
        is_active,
        open_in_new_tab
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        label_en,
        label_ar,
        href,
        parent_id || null,
        nextSortOrder,
        is_active ?? true,
        open_in_new_tab ?? false,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create navigation link error:", error);
    res.status(500).json({ error: "Create failed" });
  } finally {
    client.release();
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { label_en, label_ar, href, parent_id, is_active, open_in_new_tab } =
    req.body;

  if (!label_en || !label_ar || !href) {
    res.status(400).json({
      error: "label_en, label_ar and href are required",
    });
    return;
  }

  const { rows } = await pool.query(
    `
    UPDATE navigation_links
    SET
      label_en = $1,
      label_ar = $2,
      href = $3,
      parent_id = $4,
      is_active = $5,
      open_in_new_tab = $6,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
    `,
    [
      label_en,
      label_ar,
      href,
      parent_id || null,
      is_active ?? true,
      open_in_new_tab ?? false,
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
    DELETE FROM navigation_links
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
        UPDATE navigation_links
        SET sort_order = $1
        WHERE id = $2
        `,
        [-(i + 1), cleanIds[i]],
      );
    }

    for (let i = 0; i < cleanIds.length; i++) {
      await client.query(
        `
        UPDATE navigation_links
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
    console.error("Navigation links reorder error:", error);
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
}
