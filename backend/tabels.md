# Backend Database Schema — AIM Website (PostgreSQL)


## 1. `products`

Book-binding / printing types shown in the **ProductsSection** (home) and the products grid in the **NavBar** mega-menu.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | |
| `category_id` | `INTEGER` | `REFERENCES service_categories(id) ON DELETE SET NULL` | Mega-menu grouping |
| `slug` | `VARCHAR(150)` | `UNIQUE NOT NULL` | e.g. `hardcover-thread-sewn` |
| `title_en` | `VARCHAR(150)` | `NOT NULL` | "Hardcover" (`hl` in nav) |
| `title_ar` | `VARCHAR(150)` | `NOT NULL` | "غلاف مقوى" |
| `subtitle_en` | `VARCHAR(150)` | | "thread sewn" (`basic` in nav) |
| `subtitle_ar` | `VARCHAR(150)` | | "خياطة بالخيط" |
| `image_url` | `TEXT` | `NOT NULL` | Path or CDN URL |
| `swatch_color` | `VARCHAR(9)` | | Hex thumbnail color in nav, e.g. `#A0522D` |
| `sort_order` | `INTEGER` | `NOT NULL DEFAULT 0` | Controls display order |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Hide without deleting |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |

---

## 2. `reviews`

Powers the **ReviewsSection** testimonial slider.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | |
| `title` | `VARCHAR(200)` | `NOT NULL` | Short headline, e.g. "Professionalism 10/10" |
| `body` | `TEXT` | `NOT NULL` | Full review text |
| `author` | `VARCHAR(100)` | `NOT NULL` | Display name |
| `rating` | `SMALLINT` | `NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5)` | Star rating |
| `sort_order` | `INTEGER` | `NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |

---


## 3. `instagram_posts`

Powers the **InstagramSection** slider.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | |
| `image_url` | `TEXT` | `NOT NULL` | |
| `post_date` | `DATE` | `NOT NULL` | Date shown under the image |
| `caption` | `TEXT` | `NOT NULL` | |
| `instagram_link` | `TEXT` | `NOT NULL` | External URL to the post |
| `sort_order` | `INTEGER` | `NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |


## 4. `contact_inquiries`

Receives submissions from the **ContactSection** buttons ("Leave a message", "Ask a question") and the email link.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | |
| `name` | `VARCHAR(150)` | `NOT NULL` | |
| `email` | `VARCHAR(254)` | `NOT NULL` | |
| `phone` | `VARCHAR(30)` | | Optional |
| `message` | `TEXT` | `NOT NULL` | |
| `inquiry_type` | `VARCHAR(60)` | `NOT NULL DEFAULT 'general'` | `'general'`, `'self-publishing'`, `'quote'` |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'new'` | `'new'`, `'read'`, `'replied'` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |

---




## 5. `newsletter_subscribers`

Captures email signups from the **Footer** newsletter form.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | |
| `email` | `VARCHAR(254)` | `UNIQUE NOT NULL` | |
| `locale` | `VARCHAR(5)` | `NOT NULL DEFAULT 'en'` | `'en'` or `'ar'` |
| `is_confirmed` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Double opt-in flag |
| `unsubscribed_at` | `TIMESTAMPTZ` | | `NULL` = still subscribed |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | |

---

