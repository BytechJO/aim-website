import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Public — record a page view (silent on error, tracking must never break the site)
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { path, locale, referrer, visitor_id } = req.body;
    if (!path) { res.status(204).end(); return; }
    await pool.query(
      `INSERT INTO page_views (path, locale, referrer, visitor_id, ip)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        String(path).slice(0, 500),
        locale  ? String(locale).slice(0, 10)   : null,
        referrer ? String(referrer).slice(0, 500) : null,
        visitor_id ? String(visitor_id).slice(0, 64) : null,
        req.ip || null,
      ],
    );
  } catch {}
  res.status(204).end();
});

// Admin — aggregated stats
router.get('/', authenticate, async (_req: Request, res: Response) => {
  try {
    const [total, unique, today, week, pages, daily, locales] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS n FROM page_views`),
      pool.query(`SELECT COUNT(DISTINCT visitor_id)::int AS n FROM page_views WHERE visitor_id IS NOT NULL`),
      pool.query(`SELECT COUNT(*)::int AS n FROM page_views WHERE created_at >= CURRENT_DATE`),
      pool.query(`SELECT COUNT(*)::int AS n FROM page_views WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`),
      pool.query(`
        SELECT path, COUNT(*)::int AS views
        FROM page_views
        GROUP BY path ORDER BY views DESC LIMIT 10
      `),
      pool.query(`
        SELECT DATE(created_at) AS date, COUNT(*)::int AS views
        FROM page_views
        WHERE created_at >= CURRENT_DATE - INTERVAL '13 days'
        GROUP BY DATE(created_at) ORDER BY date ASC
      `),
      pool.query(`
        SELECT COALESCE(locale, 'unknown') AS locale, COUNT(*)::int AS views
        FROM page_views
        GROUP BY locale ORDER BY views DESC LIMIT 5
      `),
    ]);

    res.json({
      total_views:     total.rows[0].n,
      unique_visitors: unique.rows[0].n,
      today_views:     today.rows[0].n,
      this_week_views: week.rows[0].n,
      top_pages:       pages.rows,
      daily_views:     daily.rows,
      top_locales:     locales.rows,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
