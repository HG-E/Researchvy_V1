-- 020_enrollment_drip.sql
-- Tracks the 5-email post-enrollment onboarding sequence for clinic participants.
-- Run in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS enrollment_drip_emails (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_email   TEXT        NOT NULL,
  email_type   TEXT        NOT NULL  -- 'cohort_prep' | 'meet_cohort' | 'session1_reminder' | 'what_to_prepare'
                           CHECK (email_type IN ('cohort_prep','meet_cohort','session1_reminder','what_to_prepare')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enrollment_drip_pending
  ON enrollment_drip_emails (scheduled_for)
  WHERE sent_at IS NULL;
