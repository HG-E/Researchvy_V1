-- Add drip email tracking to users table.
-- Run once in Supabase SQL editor.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS drip_day2_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS drip_day5_sent_at TIMESTAMPTZ;
