-- service_categories (referenced by products)
CREATE TABLE IF NOT EXISTS service_categories (
  id          SERIAL      PRIMARY KEY,
  name_en     VARCHAR(100) NOT NULL,
  name_ar     VARCHAR(100) NOT NULL,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- users (internal staff accounts only — no public users)
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL       PRIMARY KEY,
  email           VARCHAR(254) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  job_number      VARCHAR(50)  UNIQUE NOT NULL,
  position        VARCHAR(150),
  role            VARCHAR(20)  NOT NULL DEFAULT 'admin'
                               CHECK (role IN ('admin', 'super_admin')),
  approval_status VARCHAR(20)  NOT NULL DEFAULT 'pending'
                               CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL       PRIMARY KEY,
  category_id  INTEGER      REFERENCES service_categories(id) ON DELETE SET NULL,
  slug         VARCHAR(150) UNIQUE NOT NULL,
  title_en     VARCHAR(150) NOT NULL,
  title_ar     VARCHAR(150) NOT NULL,
  subtitle_en  VARCHAR(150),
  subtitle_ar  VARCHAR(150),
  image_url    TEXT         NOT NULL,
  swatch_color VARCHAR(9),
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL       PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  body       TEXT         NOT NULL,
  author     VARCHAR(100) NOT NULL,
  rating     SMALLINT     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order INTEGER      NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- instagram_posts
CREATE TABLE IF NOT EXISTS instagram_posts (
  id              SERIAL      PRIMARY KEY,
  image_url       TEXT        NOT NULL,
  post_date       DATE        NOT NULL,
  caption         TEXT        NOT NULL,
  instagram_link  TEXT        NOT NULL,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- contact_inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id           SERIAL      PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(254) NOT NULL,
  phone        VARCHAR(30),
  message      TEXT        NOT NULL,
  inquiry_type VARCHAR(60) NOT NULL DEFAULT 'general',
  status       VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              SERIAL      PRIMARY KEY,
  email           VARCHAR(254) UNIQUE NOT NULL,
  locale          VARCHAR(5)  NOT NULL DEFAULT 'en',
  is_confirmed    BOOLEAN     NOT NULL DEFAULT FALSE,
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- extended product columns (idempotent)
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en   TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar   TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS best_use_en      TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS best_use_ar      TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS eco_friendly_en  TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS eco_friendly_ar  TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS model_3d         TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS find_out_more_images JSONB NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS example_images        JSONB NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS format_min_en    VARCHAR(300);
ALTER TABLE products ADD COLUMN IF NOT EXISTS format_min_ar    VARCHAR(300);
ALTER TABLE products ADD COLUMN IF NOT EXISTS format_max_en    VARCHAR(300);
ALTER TABLE products ADD COLUMN IF NOT EXISTS format_max_ar    VARCHAR(300);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thickness_min_en VARCHAR(150);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thickness_min_ar VARCHAR(150);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thickness_max_en VARCHAR(150);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thickness_max_ar VARCHAR(150);
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials_en     TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials_ar     TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS extras_en        TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS extras_ar        TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS enhancements_en  TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS enhancements_ar  TEXT;

-- news_articles
CREATE TABLE IF NOT EXISTS news_articles (
  id             SERIAL       PRIMARY KEY,
  slug           VARCHAR(200) UNIQUE NOT NULL,
  title_en       VARCHAR(300) NOT NULL,
  title_ar       VARCHAR(300) NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  body_en        TEXT,
  body_ar        TEXT,
  image_url      TEXT         NOT NULL,
  is_featured    BOOLEAN      NOT NULL DEFAULT FALSE,
  published_at   TIMESTAMPTZ,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- faqs
CREATE TABLE IF NOT EXISTS faqs (
  id          SERIAL      PRIMARY KEY,
  question_en TEXT        NOT NULL,
  question_ar TEXT        NOT NULL,
  answer_en   TEXT        NOT NULL,
  answer_ar   TEXT        NOT NULL,
  page        VARCHAR(60) NOT NULL DEFAULT 'self-publishing',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- benefits
CREATE TABLE IF NOT EXISTS benefits (
  id           SERIAL       PRIMARY KEY,
  title_en     VARCHAR(200) NOT NULL,
  title_ar     VARCHAR(200) NOT NULL,
  text_en      TEXT         NOT NULL,
  text_ar      TEXT         NOT NULL,
  more_text_en TEXT,
  more_text_ar TEXT,
  bg_color     VARCHAR(30)  NOT NULL,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- order_steps
CREATE TABLE IF NOT EXISTS order_steps (
  id             SERIAL       PRIMARY KEY,
  step_number    VARCHAR(5)   NOT NULL,
  title_en       VARCHAR(300) NOT NULL,
  title_ar       VARCHAR(300) NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  image_url      TEXT         NOT NULL,
  has_cta_button BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order     INTEGER      NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- page_sections
CREATE TABLE IF NOT EXISTS page_sections (
  id             SERIAL       PRIMARY KEY,
  section_key    VARCHAR(100) UNIQUE NOT NULL,
  page           VARCHAR(60)  NOT NULL,
  title_en       TEXT,
  title_ar       TEXT,
  subtitle_en    TEXT,
  subtitle_ar    TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url      TEXT,
  cta_label_en   VARCHAR(200),
  cta_label_ar   VARCHAR(200),
  cta_url        TEXT,
  extra_data     JSONB,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- navigation_links
CREATE TABLE IF NOT EXISTS navigation_links (
  id         SERIAL       PRIMARY KEY,
  location   VARCHAR(20)  NOT NULL,
  group_key  VARCHAR(60)  NOT NULL,
  label_en   VARCHAR(150) NOT NULL,
  label_ar   VARCHAR(150) NOT NULL,
  href       VARCHAR(255) NOT NULL,
  sort_order INTEGER      NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- page_views (anonymous visitor analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id          SERIAL       PRIMARY KEY,
  path        TEXT         NOT NULL,
  locale      VARCHAR(10),
  referrer    TEXT,
  visitor_id  VARCHAR(64),
  ip          VARCHAR(45),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor_id);

-- social_links
CREATE TABLE IF NOT EXISTS social_links (
  id         SERIAL      PRIMARY KEY,
  platform   VARCHAR(40) NOT NULL,
  url        TEXT        NOT NULL,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
