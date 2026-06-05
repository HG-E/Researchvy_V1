-- Migration 027: Add funding + competitive-admission fields to events + cross-link to opportunities

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS has_travel_funding       BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS funding_description      TEXT,
  ADD COLUMN IF NOT EXISTS funding_url              TEXT,
  ADD COLUMN IF NOT EXISTS is_competitive_admission BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS application_url          TEXT,
  ADD COLUMN IF NOT EXISTS linked_opportunity_id    UUID REFERENCES research_opportunities(id) ON DELETE SET NULL;

-- Index to quickly find funded events and competitive events (used in filter queries)
CREATE INDEX IF NOT EXISTS idx_events_has_travel_funding       ON events(has_travel_funding);
CREATE INDEX IF NOT EXISTS idx_events_is_competitive_admission ON events(is_competitive_admission);
CREATE INDEX IF NOT EXISTS idx_events_linked_opportunity       ON events(linked_opportunity_id);
