-- Drip sequence tracking columns for clinic and academy enquiries.
-- Safe to re-run: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

ALTER TABLE public.clinic_enquiries
  ADD COLUMN IF NOT EXISTS day3_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS day7_sent_at TIMESTAMPTZ;

ALTER TABLE public.academy_enquiries
  ADD COLUMN IF NOT EXISTS day3_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS day7_sent_at TIMESTAMPTZ;
