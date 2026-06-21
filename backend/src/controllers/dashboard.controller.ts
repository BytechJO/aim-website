import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getOverview(req: Request, res: Response): Promise<void> {
  const [
    products,
    activeProducts,

    reviews,
    activeReviews,

    instagram,
    activeInstagram,

    contacts,
    newContacts,

    newsletter,
    activeNewsletter,

    admins,
    pendingAdmins,

    recentContacts,
  ] = await Promise.all([
    // Products
    pool.query(`
      SELECT COUNT(*)::int count
      FROM products
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM products
      WHERE is_active = true
    `),

    // Reviews
    pool.query(`
      SELECT COUNT(*)::int count
      FROM reviews
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM reviews
      WHERE is_active = true
    `),

    // Instagram
    pool.query(`
      SELECT COUNT(*)::int count
      FROM instagram_posts
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM instagram_posts
      WHERE is_active = true
    `),

    // Contact Inquiries
    pool.query(`
      SELECT COUNT(*)::int count
      FROM contact_inquiries
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM contact_inquiries
      WHERE status = 'new'
    `),

    // Newsletter
    pool.query(`
      SELECT COUNT(*)::int count
      FROM newsletter_subscribers
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM newsletter_subscribers
      WHERE unsubscribed_at IS NULL
    `),

    // Staff
    pool.query(`
      SELECT COUNT(*)::int count
      FROM users
    `),

    pool.query(`
      SELECT COUNT(*)::int count
      FROM users
      WHERE approval_status = 'pending'
    `),

    // Latest 5 new inquiries
    pool.query(`
      SELECT
        id,
        name,
        email,
        inquiry_type,
        message,
        created_at
      FROM contact_inquiries
      WHERE status = 'new'
      ORDER BY created_at DESC
      LIMIT 5
    `),
  ]);

  res.json({
    products: products.rows[0].count,
    activeProducts: activeProducts.rows[0].count,

    reviews: reviews.rows[0].count,
    activeReviews: activeReviews.rows[0].count,

    instagram: instagram.rows[0].count,
    activeInstagram: activeInstagram.rows[0].count,

    contacts: contacts.rows[0].count,
    newContacts: newContacts.rows[0].count,

    newsletter: newsletter.rows[0].count,
    activeNewsletter: activeNewsletter.rows[0].count,

    admins: admins.rows[0].count,
    pendingAdmins: pendingAdmins.rows[0].count,

    recentContacts: recentContacts.rows,
  });
}
