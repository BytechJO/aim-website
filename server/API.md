# AIM Website — Backend API Reference

For the frontend team. Describes every endpoint currently implemented in the Express + PostgreSQL backend.

- **Base URL (local):** `http://localhost:3000`
- **All paths are prefixed with `/api`**
- **Content-Type:** `application/json`
- **Auth:** JWT Bearer token in the `Authorization` header → `Authorization: Bearer <token>`

---

## Permission model

This backend has **no public user accounts**. Authentication exists only for **internal staff/management**. There are exactly two roles:

| Role | Capabilities |
|---|---|
| **super_admin** | Full system access. Approves/rejects admin registrations, promotes/demotes admins, plus everything an admin can do. |
| **admin** (approved) | Full access to all management endpoints. Cannot manage other admins. |
| **admin** (pending) | Has logged in but **no privileges yet** — must be approved by a super_admin. |

Each account also has an `approval_status`: `pending` → `approved` / `rejected`.

**Public visitors need no token.** Only two endpoints are public for them: submitting a contact inquiry and subscribing to the newsletter (see below).

> Approval/role changes are enforced against the **live database** on every request, so demoting or rejecting an account takes effect immediately even if it still holds a valid token.

---

## Auth

### `POST /api/auth/register`
Public. Creates a **staff/admin** account. Every new account is created as `role = admin`, `approval_status = pending` and stays inactive until a super_admin approves it. There is no way to self-register as super_admin.

**Body**
```json
{
  "email": "admin@example.com",
  "password": "secret123",
  "full_name": "John Smith",
  "job_number": "EMP-1001",
  "position": "Marketing Manager"
}
```
- Required: `email`, `password`, `full_name`, `job_number`.
- `position` optional.

**201**
```json
{
  "message": "Admin account created and awaiting super admin approval",
  "approval_status": "pending"
}
```
**400** — `{ "error": "email, password, full_name, and job_number are required" }`
**409** — `{ "error": "Email or job number already registered" }`

---

### `POST /api/auth/login`
Public. Returns the token used for all protected requests.

**Body**
```json
{ "email": "admin@example.com", "password": "secret123" }
```
**200**
```json
{ "token": "eyJhbGciOi...", "role": "admin", "approval_status": "pending" }
```
- A **pending** admin can log in but will get `403` on protected routes until approved. The frontend can read `approval_status` to show an "awaiting approval" screen.

**401** — `{ "error": "Invalid credentials" }`

**Usage:** send the token on every protected request:
```
Authorization: Bearer eyJhbGciOi...
```

---

## Admin management  `/api/admins`
🔒 **super_admin only.**

| Method | Path | Description |
|---|---|---|
| GET | `/api/admins` | List all staff accounts. Optional `?status=pending\|approved\|rejected` |
| GET | `/api/admins/:id` | Single account |
| PUT | `/api/admins/:id/approval` | Approve or reject a registration |
| PUT | `/api/admins/:id/role` | Promote to super_admin / demote to admin |
| DELETE | `/api/admins/:id` | Delete an account |

**Account object** (password hash is never returned)
```json
{
  "id": 2,
  "email": "admin@example.com",
  "full_name": "John Smith",
  "job_number": "EMP-1001",
  "position": "Marketing Manager",
  "role": "admin",
  "approval_status": "pending",
  "created_at": "2026-06-07T10:00:00.000Z",
  "updated_at": "2026-06-07T10:00:00.000Z"
}
```

**`PUT /:id/approval` body** — `{ "approval_status": "approved" }` (or `"rejected"`).
**`PUT /:id/role` body** — `{ "role": "super_admin" }` (or `"admin"`). Promoting also sets `approval_status = approved`.

**Guards (return `409`):**
- Demoting the last remaining super_admin → `{ "error": "Cannot demote the last remaining super_admin" }`
- Deleting the last remaining super_admin → `{ "error": "Cannot delete the last remaining super_admin" }`

---

## Products  `/api/products`
🔒 **Approved admin or super_admin on all methods.**

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List, ordered by `sort_order ASC` |
| GET | `/api/products/:id` | Single |
| POST | `/api/products` | Create |
| PUT | `/api/products/:id` | Update (full replace) |
| DELETE | `/api/products/:id` | Delete |

**Product object**
```json
{
  "id": 1,
  "category_id": 2,
  "slug": "hardcover-thread-sewn",
  "title_en": "Hardcover",
  "title_ar": "غلاف مقوى",
  "subtitle_en": "thread sewn",
  "subtitle_ar": "خياطة بالخيط",
  "image_url": "/homeImg/book.svg",
  "swatch_color": "#A0522D",
  "sort_order": 0,
  "is_active": true,
  "created_at": "2026-06-07T10:00:00.000Z",
  "updated_at": "2026-06-07T10:00:00.000Z"
}
```
**POST / PUT body** — same fields except `id`, `created_at`, `updated_at`. `sort_order` defaults to `0`, `is_active` to `true`.

---

## Reviews  `/api/reviews`
🔒 **Approved admin or super_admin on all methods.**

| Method | Path | Description |
|---|---|---|
| GET | `/api/reviews` | List, ordered by `sort_order ASC` |
| GET | `/api/reviews/:id` | Single |
| POST | `/api/reviews` | Create |
| PUT | `/api/reviews/:id` | Update |
| DELETE | `/api/reviews/:id` | Delete |

**Review object**
```json
{
  "id": 1,
  "title": "Professionalism 10/10",
  "body": "Entrusting your first book to us...",
  "author": "Anita",
  "rating": 5,
  "sort_order": 0,
  "is_active": true,
  "created_at": "2026-06-07T10:00:00.000Z",
  "updated_at": "2026-06-07T10:00:00.000Z"
}
```
- `rating` 1–5 (defaults to `5`).

---

## Instagram  `/api/instagram`
🔒 **Approved admin or super_admin on all methods.**

| Method | Path | Description |
|---|---|---|
| GET | `/api/instagram` | List, ordered by `sort_order ASC` |
| GET | `/api/instagram/:id` | Single |
| POST | `/api/instagram` | Create |
| PUT | `/api/instagram/:id` | Update |
| DELETE | `/api/instagram/:id` | Delete |

**Instagram post object**
```json
{
  "id": 1,
  "image_url": "/homeImg/instagram/post1.svg",
  "post_date": "2026-01-20",
  "caption": "Time for a 'private moment' ...",
  "instagram_link": "https://instagram.com/p/...",
  "sort_order": 0,
  "is_active": true,
  "created_at": "2026-06-07T10:00:00.000Z",
  "updated_at": "2026-06-07T10:00:00.000Z"
}
```
- `post_date` is a date string `YYYY-MM-DD`.

---

## Contact  `/api/contact`

| Method | Path | Auth | Description |
|---|---|---|---|
| **POST** | `/api/contact` | **public** | Submit an inquiry — no token required |
| GET | `/api/contact` | admin | List inquiries, newest first |
| GET | `/api/contact/:id` | admin | Single |
| PUT | `/api/contact/:id` | admin | Update `status` only |
| DELETE | `/api/contact/:id` | admin | Delete |

("admin" = approved admin or super_admin.)

**POST body** (public)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+48123456789",
  "message": "I'd like a quote for 200 hardcover books.",
  "inquiry_type": "quote"
}
```
- Required: `name`, `email`, `message`.
- `phone` optional. `inquiry_type` optional, defaults to `"general"` (e.g. `"general"`, `"self-publishing"`, `"quote"`).

**400** — `{ "error": "name, email, and message are required" }`

**PUT body** (admin) — `{ "status": "read" }` → values: `"new"`, `"read"`, `"replied"`.

**Inquiry object**
```json
{
  "id": 1, "name": "Jane Doe", "email": "jane@example.com", "phone": "+48123456789",
  "message": "...", "inquiry_type": "quote", "status": "new",
  "created_at": "...", "updated_at": "..."
}
```

---

## Newsletter  `/api/newsletter`

| Method | Path | Auth | Description |
|---|---|---|---|
| **POST** | `/api/newsletter/subscribe` | **public** | Subscribe — no token required (upsert by email) |
| GET | `/api/newsletter` | admin | List subscribers, newest first |
| GET | `/api/newsletter/:id` | admin | Single |
| PUT | `/api/newsletter/:id` | admin | Update confirm / unsubscribe |
| DELETE | `/api/newsletter/:id` | admin | Delete |

("admin" = approved admin or super_admin.)

**POST `/subscribe` body** (public)
```json
{ "email": "jane@example.com", "locale": "en" }
```
- Required: `email`. `locale` optional (`"en"` / `"ar"`, defaults `"en"`).
- Idempotent: subscribing an existing email updates its `locale` instead of erroring.

**400** — `{ "error": "Email is required" }`

**Subscriber object**
```json
{
  "id": 1, "email": "jane@example.com", "locale": "en",
  "is_confirmed": false, "unsubscribed_at": null,
  "created_at": "..."
}
```
**PUT body** (admin) — `{ "is_confirmed": true, "unsubscribed_at": null }`

---

## Conventions

**Status codes**
| Code | Meaning |
|---|---|
| 200 | OK (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE — empty body) |
| 400 | Validation error |
| 401 | Missing/invalid token, or account deleted |
| 403 | Authenticated but lacks the required role/approval |
| 404 | `{ "error": "Not found" }` |
| 409 | Conflict (duplicate email/job number, or last-super_admin guard) |

**Error shape** — always `{ "error": "<message>" }`.

**Auth header** — `Authorization: Bearer <token>` on every protected route. A missing token returns `401 { "error": "Unauthorized — token required" }`; an expired/invalid one returns `401 { "error": "Invalid or expired token" }`. A valid token without sufficient role returns `403` (`Forbidden — approved admin access required` or `Forbidden — super admin access required`).

**Public fetch example** (visitor submitting a contact form — no token)
```ts
await fetch("http://localhost:3000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message }),
});
```

**Admin fetch example**
```ts
const res = await fetch("http://localhost:3000/api/products", {
  headers: { Authorization: `Bearer ${token}` },
});
const products = await res.json();
```

---

## Initial system setup

The backend guarantees at least one super_admin exists. On startup it runs a seed that creates an **approved super_admin** from environment variables — but only if no super_admin exists yet (idempotent, safe to leave on).

`.env`:
```
SUPER_ADMIN_EMAIL=owner@aim.com
SUPER_ADMIN_PASSWORD=change_me
SUPER_ADMIN_FULL_NAME=System Owner
SUPER_ADMIN_JOB_NUMBER=EMP-0001
SUPER_ADMIN_POSITION=Owner   # optional
```
If these are unset and no super_admin exists, the server logs a warning and starts without one. The last remaining super_admin cannot be demoted or deleted.

---

## Not yet implemented

These tables exist in `schema.sql` but have **no routes/controllers yet** — coordinate with the backend dev before building UI that depends on them:

- `service_categories`
- `news_articles`
- `faqs`
- `benefits`
- `order_steps`
- `page_sections`
- `navigation_links`
- `social_links`

---

## Open questions

1. **Public read access** — the homepage needs products, reviews, and instagram without a login, but those GETs are still admin-only. Backend needs public GET routes (or relaxed middleware) before the public site can consume them.
2. **CORS** — no CORS middleware is configured yet; the Next.js app on a different origin will be blocked until `cors` is added.
3. **List filtering** — GET list endpoints return *all* rows including `is_active = false`. If the frontend should only see active items, ask for an `?active=true` filter.
4. **Pagination** — list endpoints return everything with no pagination; revisit for news/reviews if they grow.
