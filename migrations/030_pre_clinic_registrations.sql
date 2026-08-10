-- 030_pre_clinic_registrations.sql
-- Registrations for the free Researchvy Pre-Clinic (ORCID workshop).
-- Anonymous registrations are recorded — no login required.

-- 1. Registration records table
CREATE TABLE IF NOT EXISTS public.pre_clinic_registrations (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Identity
  full_name         TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  phone             TEXT        NOT NULL,

  -- Session choice
  session           TEXT        NOT NULL CHECK (session IN ('saturday', 'sunday', 'both')),

  -- Lead qualification (for the paid-clinic funnel afterward)
  career_stage      TEXT        NOT NULL CHECK (career_stage IN (
                      'undergraduate', 'postgraduate', 'phd', 'early_career', 'established', 'other'
                    )),
  field_of_research TEXT        NOT NULL,
  institution        TEXT,

  -- Traffic source (best-effort from Referer header or utm_source cookie)
  source            TEXT,

  -- Admin workflow state
  status            TEXT        NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'contacted', 'attended', 'no_show', 'converted')),
  admin_notes       TEXT
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS pre_clinic_registrations_created_at ON public.pre_clinic_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS pre_clinic_registrations_status     ON public.pre_clinic_registrations (status);
CREATE UNIQUE INDEX IF NOT EXISTS pre_clinic_registrations_email_unique ON public.pre_clinic_registrations (lower(email));

-- 3. RLS: anonymous users can INSERT (no login required to register)
ALTER TABLE public.pre_clinic_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pre_clinic_anon_insert"
  ON public.pre_clinic_registrations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "pre_clinic_auth_insert"
  ON public.pre_clinic_registrations FOR INSERT TO authenticated
  WITH CHECK (true);

-- Admin (service role) bypasses RLS entirely — no policy needed.
-- Authenticated SELECT: intentionally NOT granted via RLS.
-- Admins read via service role client only.
