-- 024_opportunity_sources.sql
-- Tracks RSS feed sources for the auto-fetch cron job.
-- Also stores per-source fetch state (last_fetched_at, error_count).
-- Run in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS opportunity_sources (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,         -- "NIH Funding Opportunities"
  url             TEXT        UNIQUE NOT NULL,  -- RSS feed URL
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  last_item_count INT         NOT NULL DEFAULT 0,
  error_count     INT         NOT NULL DEFAULT 0,
  last_error      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with confirmed working RSS sources
INSERT INTO opportunity_sources (name, url) VALUES
  ('NIH Funding Opportunities',         'https://grants.nih.gov/grants/guide/newsfeed/fundingopps.xml'),
  ('Nature Jobs — Science',             'https://feeds.nature.com/naturejobs/rss/sciencejobs'),
  ('NSF Funding Opportunities',         'https://www.nsf.gov/rss/rss_www_funding.xml'),
  ('EU Research & Innovation',          'https://research-and-innovation.ec.europa.eu/news/rss_en')
ON CONFLICT (url) DO NOTHING;

-- Track which auto-fetched opportunities came from which source
ALTER TABLE research_opportunities
  ADD COLUMN IF NOT EXISTS source_id   UUID REFERENCES opportunity_sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_url  TEXT,           -- original item link from feed
  ADD COLUMN IF NOT EXISTS auto_fetched BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS opp_auto_fetched
  ON research_opportunities (auto_fetched, is_published)
  WHERE auto_fetched = true;
