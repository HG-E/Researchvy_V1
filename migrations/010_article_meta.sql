-- 010_article_meta.sql
-- CMS metadata overrides + view/share analytics per article slug.
-- All fields are nullable overrides; NULL means "use MDX default".

CREATE TABLE IF NOT EXISTS article_meta (
  slug            TEXT         PRIMARY KEY,
  title           TEXT,
  excerpt         TEXT,
  featured_image  TEXT,
  body_md         TEXT,
  category        TEXT,
  tags            TEXT[]       DEFAULT '{}',
  reading_time    INTEGER,
  published_at    TIMESTAMPTZ,
  is_published    BOOLEAN      NOT NULL DEFAULT TRUE,
  view_count      INTEGER      NOT NULL DEFAULT 0,
  share_count     INTEGER      NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE article_meta ENABLE ROW LEVEL SECURITY;

-- Public can read (view counts show on public article pages)
DROP POLICY IF EXISTS "article_meta_public_read" ON article_meta;
CREATE POLICY "article_meta_public_read" ON article_meta
  FOR SELECT USING (true);

-- Atomic view increment (upserts row if it doesn't exist yet)
CREATE OR REPLACE FUNCTION increment_article_view(p_slug TEXT)
RETURNS VOID
LANGUAGE SQL AS $$
  INSERT INTO article_meta (slug, view_count)
  VALUES (p_slug, 1)
  ON CONFLICT (slug) DO UPDATE
    SET view_count = article_meta.view_count + 1;
$$;

-- Atomic share increment
CREATE OR REPLACE FUNCTION increment_article_share(p_slug TEXT)
RETURNS VOID
LANGUAGE SQL AS $$
  INSERT INTO article_meta (slug, share_count)
  VALUES (p_slug, 1)
  ON CONFLICT (slug) DO UPDATE
    SET share_count = article_meta.share_count + 1;
$$;
