-- 022_opportunities.sql
-- Research Opportunities Board: grants, fellowships, speaking invitations,
-- conferences, collaboration calls, and job postings for researchers.
-- Curated by admin. Community submissions added in a future migration.
-- Run in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS research_opportunities (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL,                    -- markdown supported
  category     TEXT        NOT NULL
                           CHECK (category IN (
                             'grant','fellowship','conference','speaking',
                             'collaboration','job','award','other'
                           )),
  funder       TEXT,                                    -- e.g. "Wellcome Trust", "TWAS"
  value        TEXT,                                    -- e.g. "$50,000" or "Travel funded"
  currency     TEXT DEFAULT 'usd',
  deadline     DATE,                                    -- null = rolling
  apply_url    TEXT        NOT NULL,
  target_level TEXT DEFAULT 'all'                       -- 'early_career','mid','senior','all'
                           CHECK (target_level IN ('early_career','mid','senior','all')),
  is_published BOOLEAN     NOT NULL DEFAULT false,
  is_featured  BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS opp_published_deadline
  ON research_opportunities (is_published, deadline)
  WHERE is_published = true;

-- Helper: auto-update updated_at
CREATE OR REPLACE FUNCTION update_opportunities_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_opportunities_updated_at ON research_opportunities;
CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON research_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

ALTER TABLE research_opportunities ENABLE ROW LEVEL SECURITY;

-- Public can read published opportunities (no login required)
CREATE POLICY "opportunities_public_read"
  ON research_opportunities FOR SELECT
  USING (is_published = true);
