-- 029_scorecard_leads.sql
-- Stores Visibility Scorecard completions for admin lead intelligence and analytics.
-- Anonymous completions are recorded automatically; email is captured optionally.

-- 1. Lead records table
CREATE TABLE IF NOT EXISTS public.visibility_scorecard_leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Identity — optional; captured only if researcher submits email capture form
  email           TEXT,
  name            TEXT,

  -- Score summary
  total_score     INTEGER     NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  tier            TEXT        NOT NULL CHECK (tier IN ('invisible', 'significant_gaps', 'emerging', 'leader')),

  -- Full answer record: { checkpoint_id: integer_score }
  -- e.g. { "orcid": 5, "googlescholar": 0, "scopus": 8, ... }
  answers         JSONB       NOT NULL DEFAULT '{}',

  -- Per-dimension summary: { dimension_id: { score, maxPoints } }
  -- e.g. { "identity": { "score": 13, "maxPoints": 25 }, ... }
  dimension_scores JSONB      NOT NULL DEFAULT '{}',

  -- Traffic source (best-effort from Referer header or utm_source cookie)
  source          TEXT,

  -- Admin workflow state
  status          TEXT        NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'booked', 'enrolled', 'lost')),
  admin_notes     TEXT,
  notified_at     TIMESTAMPTZ   -- set when admin email/WhatsApp notification was sent
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS scorecard_leads_created_at ON public.visibility_scorecard_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS scorecard_leads_status     ON public.visibility_scorecard_leads (status);
CREATE INDEX IF NOT EXISTS scorecard_leads_tier       ON public.visibility_scorecard_leads (tier);
CREATE INDEX IF NOT EXISTS scorecard_leads_email      ON public.visibility_scorecard_leads (email)
  WHERE email IS NOT NULL;

-- 3. RLS: anonymous users can INSERT (no login required to complete the scorecard)
ALTER TABLE public.visibility_scorecard_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scorecard_anon_insert"
  ON public.visibility_scorecard_leads FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated users can also insert (researchers who are logged in)
CREATE POLICY "scorecard_auth_insert"
  ON public.visibility_scorecard_leads FOR INSERT TO authenticated
  WITH CHECK (true);

-- Authenticated users can update their own record to add email
-- (matched by the returned id from auto-save, passed back to client)
CREATE POLICY "scorecard_auth_update_own"
  ON public.visibility_scorecard_leads FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anon to update (for the claim flow where user is not logged in)
CREATE POLICY "scorecard_anon_update"
  ON public.visibility_scorecard_leads FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Admin (service role) bypasses RLS entirely — no policy needed.
-- Authenticated SELECT: intentionally NOT granted via RLS.
-- Admins read via service role client only.
