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
  const {
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
    `INSERT INTO products (
      slug, title_en, title_ar, subtitle_en, subtitle_ar,
      image_url, sort_order, is_active,
      description_en, description_ar, best_use_en, best_use_ar,
      eco_friendly_en, eco_friendly_ar, model_3d,
      find_out_more_images, example_images,
      format_min_en, format_min_ar, format_max_en, format_max_ar,
      thickness_min_en, thickness_min_ar, thickness_max_en, thickness_max_ar,
      materials_en, materials_ar, extras_en, extras_ar,
      enhancements_en, enhancements_ar
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,
      $9,$10,$11,$12,$13,$14,$15,$16,$17,
      $18,$19,$20,$21,$22,$23,$24,$25,
      $26,$27,$28,$29,$30,$31
    ) RETURNING *`,
    [
      slug,
      title_en,
      title_ar,
      subtitle_en ?? null,
      subtitle_ar ?? null,
      image_url,
      sort_order ?? 0,
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

  res.status(201).json(rows[0]);
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
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
    `UPDATE products SET
      slug=$1,
      title_en=$2,
      title_ar=$3,
      subtitle_en=$4,
      subtitle_ar=$5,
      image_url=$6,
      sort_order=$7,
      is_active=$8,
      description_en=$9,
      description_ar=$10,
      best_use_en=$11,
      best_use_ar=$12,
      eco_friendly_en=$13,
      eco_friendly_ar=$14,
      model_3d=$15,
      find_out_more_images=$16,
      example_images=$17,
      format_min_en=$18,
      format_min_ar=$19,
      format_max_en=$20,
      format_max_ar=$21,
      thickness_min_en=$22,
      thickness_min_ar=$23,
      thickness_max_en=$24,
      thickness_max_ar=$25,
      materials_en=$26,
      materials_ar=$27,
      extras_en=$28,
      extras_ar=$29,
      enhancements_en=$30,
      enhancements_ar=$31,
      updated_at=NOW()
    WHERE id=$32
    RETURNING *`,
    [
      slug,
      title_en,
      title_ar,
      subtitle_en ?? null,
      subtitle_ar ?? null,
      image_url,
      sort_order,
      is_active,
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
