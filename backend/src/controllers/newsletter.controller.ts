import { Request, Response } from "express";
import crypto from "crypto";
import { pool } from "../config/db";
import { emit } from "../socket";
import { sendNewsletterConfirmationEmail } from "../helpers/mailer";
export async function getAll(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC",
  );
  res.json(rows);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { rows } = await pool.query(
    "SELECT * FROM newsletter_subscribers WHERE id = $1",
    [req.params.id],
  );
  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(rows[0]);
}

const RESEND_COOLDOWN_SECONDS = 45;

export async function subscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email, locale } = req.body;
    console.log("Subscribe API hit:", req.body?.email);
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanLocale = locale ?? "en";

    const existing = await pool.query(
      `
      SELECT 
        id,
        email,
        is_confirmed,
        unsubscribed_at,
        confirmation_code,
        confirmation_sent_at,
        CASE
          WHEN confirmation_sent_at IS NULL THEN NULL
          ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - confirmation_sent_at)))
        END AS seconds_since_sent
      FROM newsletter_subscribers
      WHERE email = $1
      `,
      [cleanEmail],
    );

    const existingSubscriber = existing.rows[0];

    if (
      existingSubscriber &&
      existingSubscriber.is_confirmed === true &&
      existingSubscriber.unsubscribed_at === null
    ) {
      res.status(409).json({
        error: "already_subscribed",
        message: "This email is already subscribed to our newsletter.",
      });
      return;
    }

    if (
      existingSubscriber &&
      existingSubscriber.is_confirmed === false &&
      existingSubscriber.confirmation_code &&
      existingSubscriber.confirmation_sent_at
    ) {
      const secondsSinceSent = Number(
        existingSubscriber.seconds_since_sent ?? 0,
      );

      const remainingSeconds = RESEND_COOLDOWN_SECONDS - secondsSinceSent;

      if (remainingSeconds > 0) {
        res.status(429).json({
          error: "confirmation_code_recently_sent",
          message: "A confirmation code was already sent recently.",
          email: cleanEmail,
          remainingSeconds,
        });
        return;
      }
    }

    const confirmationCode = crypto.randomInt(100000, 1000000).toString();

    const { rows } = await pool.query(
      `
      INSERT INTO newsletter_subscribers 
        (
          email, 
          locale, 
          is_confirmed, 
          confirmation_code, 
          confirmation_sent_at, 
          confirmed_at
        )
      VALUES 
        ($1, $2, false, $3, NOW(), null)
      ON CONFLICT (email) DO UPDATE SET
        locale = EXCLUDED.locale,
        is_confirmed = false,
        confirmation_code = EXCLUDED.confirmation_code,
        confirmation_sent_at = NOW(),
        confirmed_at = null,
        unsubscribed_at = null
      RETURNING *
      `,
      [cleanEmail, cleanLocale, confirmationCode],
    );

    await sendNewsletterConfirmationEmail(
      cleanEmail,
      confirmationCode,
      cleanLocale,
    );

    emit("new_subscriber", {
      email: rows[0].email,
      locale: rows[0].locale,
      is_confirmed: rows[0].is_confirmed,
    });

    res.status(201).json({
      message: "Confirmation code sent",
      email: cleanEmail,
      remainingSeconds: RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { is_confirmed, unsubscribed_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE newsletter_subscribers SET is_confirmed=$1, unsubscribed_at=$2 WHERE id=$3 RETURNING *`,
    [is_confirmed, unsubscribed_at ?? null, req.params.id],
  );
  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(rows[0]);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { rowCount } = await pool.query(
    "DELETE FROM newsletter_subscribers WHERE id = $1",
    [req.params.id],
  );
  if (!rowCount) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
}
export async function confirmSubscription(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: "Email and code are required" });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();

    const { rows } = await pool.query(
      `
      UPDATE newsletter_subscribers
      SET 
        is_confirmed = true,
        confirmed_at = NOW(),
        confirmation_code = null
      WHERE 
        email = $1
        AND confirmation_code = $2
      RETURNING *
      `,
      [cleanEmail, cleanCode],
    );

    if (!rows[0]) {
      res.status(400).json({ error: "Invalid confirmation code" });
      return;
    }

    res.json({
      message: "Subscription confirmed successfully",
      subscriber: rows[0],
    });
  } catch (error) {
    console.error("Confirm subscription error:", error);
    res.status(500).json({ error: "Failed to confirm subscription" });
  }
}
