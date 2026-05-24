-- ─────────────────────────────────────────────────────────────────────────────
-- RESEARCHVY — Email sequence tracking columns
-- Safe to re-run: uses IF NOT EXISTS pattern.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.newsletters
  ADD COLUMN IF NOT EXISTS day3_sent_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS day7_sent_at  TIMESTAMPTZ;
