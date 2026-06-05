-- 025_events.sql
-- Academia Events Portal: conferences, seminars, workshops, webinars, panels,
-- hackathons, symposiums, and lectures. Supports community submissions with
-- admin review, internal RSVP, and save-for-later bookmarking.
-- Run in Supabase Dashboard → SQL Editor.

-- ── Core events table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                    TEXT        NOT NULL,
  slug                     TEXT        NOT NULL UNIQUE,
  description              TEXT        NOT NULL,            -- full markdown body
  short_description        TEXT,                            -- 1–2 sentence card blurb
  event_type               TEXT        NOT NULL
                           CHECK (event_type IN (
                             'conference','seminar','workshop','symposium',
                             'webinar','lecture','panel','hackathon','other'
                           )),
  format                   TEXT        NOT NULL DEFAULT 'in-person'
                           CHECK (format IN ('in-person','virtual','hybrid')),
  location                 TEXT,                            -- city/country or "Online"
  venue                    TEXT,                            -- venue or platform name
  timezone                 TEXT        DEFAULT 'Africa/Lagos',
  start_date               TIMESTAMPTZ NOT NULL,
  end_date                 TIMESTAMPTZ,
  registration_deadline    TIMESTAMPTZ,
  featured_image           TEXT,                            -- absolute URL
  website_url              TEXT,                            -- organizer's event page
  registration_url         TEXT,                            -- where to register
  registration_type        TEXT        DEFAULT 'external'
                           CHECK (registration_type IN ('external','internal','none')),
  capacity                 INT,                             -- null = unlimited
  is_free                  BOOLEAN     NOT NULL DEFAULT true,
  fee_amount               NUMERIC(10,2),
  fee_currency             TEXT        DEFAULT 'NGN',
  call_for_papers_url      TEXT,
  call_for_papers_deadline TIMESTAMPTZ,
  organizer_name           TEXT        NOT NULL,
  organizer_email          TEXT,
  organizer_type           TEXT        DEFAULT 'external'
                           CHECK (organizer_type IN ('external','partner','researchvy')),
  target_audience          TEXT        DEFAULT 'all'
                           CHECK (target_audience IN ('early_career','mid','senior','all')),
  disciplines              TEXT[]      DEFAULT '{}',       -- ['microbiology','public-health',…]
  tags                     TEXT[]      DEFAULT '{}',
  -- status lifecycle: pending → approved/rejected → published → featured/archived/cancelled
  status                   TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN (
                             'pending','approved','published','featured',
                             'rejected','cancelled','archived'
                           )),
  is_featured              BOOLEAN     NOT NULL DEFAULT false,
  submitted_by             UUID        REFERENCES users(id) ON DELETE SET NULL,
  reviewed_by              UUID        REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at              TIMESTAMPTZ,
  review_note              TEXT,                            -- admin approval/rejection note
  views_count              INT         NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_status_start_date
  ON events (status, start_date);

CREATE INDEX IF NOT EXISTS events_type_status
  ON events (event_type, status);

CREATE INDEX IF NOT EXISTS events_featured
  ON events (is_featured, start_date)
  WHERE is_featured = true AND status IN ('published','featured');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_events_updated_at ON events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_events_updated_at();

-- ── Event registrations (internal RSVP) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS event_registrations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID        REFERENCES users(id) ON DELETE SET NULL,
  guest_email   TEXT,                                       -- for unauthenticated RSVP
  guest_name    TEXT,
  status        TEXT        NOT NULL DEFAULT 'registered'
                CHECK (status IN ('registered','waitlisted','cancelled','attended')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes         TEXT,
  CONSTRAINT one_registration_per_user UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_regs_event_id ON event_registrations (event_id);
CREATE INDEX IF NOT EXISTS event_regs_user_id  ON event_registrations (user_id);

-- ── Event saves (bookmarks) ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS event_saves (
  event_id UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id  UUID        NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_saves_user_id ON event_saves (user_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_saves         ENABLE ROW LEVEL SECURITY;

-- events: public read of published/featured; submitters see their own pending; admin sees all
CREATE POLICY "events_public_read"
  ON events FOR SELECT
  USING (status IN ('published','featured'));

CREATE POLICY "events_own_read"
  ON events FOR SELECT
  USING (submitted_by = auth.uid());

CREATE POLICY "events_authenticated_insert"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND submitted_by = auth.uid());

CREATE POLICY "events_own_update_pending"
  ON events FOR UPDATE
  USING (submitted_by = auth.uid() AND status = 'pending')
  WITH CHECK (submitted_by = auth.uid());

-- event_registrations: users manage their own; public view count via aggregate only
CREATE POLICY "event_regs_own_read"
  ON event_registrations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "event_regs_own_insert"
  ON event_registrations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "event_regs_own_cancel"
  ON event_registrations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- event_saves: users manage their own bookmarks
CREATE POLICY "event_saves_own_all"
  ON event_saves FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
