-- ─────────────────────────────────────────────────────────────────────────────
-- RESEARCHVY — Initial Database Schema
-- Run this in Supabase SQL Editor to create all Phase 1 tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. USERS
-- Extends Supabase Auth — created via trigger on auth.users insert.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                     TEXT NOT NULL UNIQUE,
  full_name                 TEXT NOT NULL DEFAULT '',
  avatar_url                TEXT,
  bio                       TEXT,
  orcid                     TEXT,
  google_scholar            TEXT,
  institutional_affiliation TEXT,
  role                      TEXT NOT NULL DEFAULT 'user'
                              CHECK (role IN ('user','researcher','partner','admin')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CLINICS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinics (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT,
  featured_image   TEXT,
  start_date       TIMESTAMPTZ NOT NULL,
  end_date         TIMESTAMPTZ NOT NULL,
  location         TEXT NOT NULL DEFAULT 'Online',
  capacity         INTEGER NOT NULL DEFAULT 50,
  price            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','published','archived')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinics_status  ON public.clinics(status);
CREATE INDEX idx_clinics_slug    ON public.clinics(slug);
CREATE INDEX idx_clinics_start   ON public.clinics(start_date);

CREATE TRIGGER clinics_updated_at
  BEFORE UPDATE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CLINIC REGISTRATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinic_registrations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id       UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'registered'
                    CHECK (status IN ('registered','attended','completed')),
  certificate_url TEXT,
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended_at     TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  UNIQUE (clinic_id, user_id)
);

CREATE INDEX idx_reg_clinic ON public.clinic_registrations(clinic_id);
CREATE INDEX idx_reg_user   ON public.clinic_registrations(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. INSIGHTS
-- Primary content for blog/articles (may also be managed in Sanity CMS).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insights (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         TEXT NOT NULL DEFAULT '',
  excerpt         TEXT NOT NULL DEFAULT '',
  author_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  featured_image  TEXT,
  category        TEXT NOT NULL DEFAULT 'scholarly-visibility'
                    CHECK (category IN (
                      'scholarly-visibility','research-intelligence',
                      'scholarly-communication','modern-scholarly-systems',
                      'institutional-positioning'
                    )),
  tags            TEXT[] NOT NULL DEFAULT '{}',
  reading_time    INTEGER NOT NULL DEFAULT 5,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insights_published  ON public.insights(published);
CREATE INDEX idx_insights_category   ON public.insights(category);
CREATE INDEX idx_insights_slug       ON public.insights(slug);
CREATE INDEX idx_insights_author     ON public.insights(author_id);

CREATE TRIGGER insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RESOURCES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resources (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_url    TEXT NOT NULL DEFAULT '',
  file_type   TEXT NOT NULL DEFAULT 'pdf'
                CHECK (file_type IN ('pdf','docx','xlsx','pptx','zip')),
  category    TEXT NOT NULL DEFAULT 'guide'
                CHECK (category IN ('guide','checklist','template','report','toolkit','workbook')),
  tags        TEXT[] NOT NULL DEFAULT '{}',
  downloads   INTEGER NOT NULL DEFAULT 0,
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_featured ON public.resources(featured);

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. NEWSLETTERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletters (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email            TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL DEFAULT '',
  subscribed       BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at  TIMESTAMPTZ
);

CREATE INDEX idx_newsletters_subscribed ON public.newsletters(subscribed);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CERTIFICATES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.certificates (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  clinic_id          UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_code  TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, clinic_id)
);

CREATE INDEX idx_certs_user   ON public.certificates(user_id);
CREATE INDEX idx_certs_clinic ON public.certificates(clinic_id);
CREATE INDEX idx_certs_code   ON public.certificates(verification_code);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates         ENABLE ROW LEVEL SECURITY;

-- Users: read own profile; admins read all
CREATE POLICY "users_read_own"    ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Clinics: public read published; admin full access
CREATE POLICY "clinics_public_read"
  ON public.clinics FOR SELECT USING (status = 'published');

-- Registrations: users manage their own
CREATE POLICY "reg_read_own"
  ON public.clinic_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reg_insert_own"
  ON public.clinic_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insights: public read published
CREATE POLICY "insights_public_read"
  ON public.insights FOR SELECT USING (published = TRUE);

-- Resources: public read all
CREATE POLICY "resources_public_read"
  ON public.resources FOR SELECT USING (TRUE);

-- Newsletters: insert open; read own
CREATE POLICY "newsletter_insert"
  ON public.newsletters FOR INSERT WITH CHECK (TRUE);

-- Certificates: read own
CREATE POLICY "certs_read_own"
  ON public.certificates FOR SELECT USING (auth.uid() = user_id);
