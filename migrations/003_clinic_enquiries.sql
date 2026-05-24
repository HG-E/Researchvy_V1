-- ─────────────────────────────────────────────────────────────────────────────
-- RESEARCHVY — Clinic Enquiries / Interest Registration
-- Tracks authenticated users who have registered interest in a clinic.
-- Safe to re-run: uses IF NOT EXISTS throughout.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clinic_enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  clinic_slug TEXT NOT NULL DEFAULT 'digital-visibility-clinic',
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  notes       TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'contacted', 'enrolled', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, clinic_slug)
);

CREATE INDEX IF NOT EXISTS idx_enquiries_user   ON public.clinic_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_clinic ON public.clinic_enquiries(clinic_slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.clinic_enquiries(status);

ALTER TABLE public.clinic_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enquiry_read_own"   ON public.clinic_enquiries;
DROP POLICY IF EXISTS "enquiry_insert_own" ON public.clinic_enquiries;

CREATE POLICY "enquiry_read_own"
  ON public.clinic_enquiries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "enquiry_insert_own"
  ON public.clinic_enquiries FOR INSERT WITH CHECK (auth.uid() = user_id);
