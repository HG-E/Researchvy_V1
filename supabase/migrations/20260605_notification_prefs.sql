-- ── Opportunity Saves ─────────────────────────────────────────────────────────
-- Mirrors the event_saves pattern. Users bookmark opportunities they care about;
-- the deadline-reminder cron only notifies users who saved the opportunity
-- (not every user on the platform).

CREATE TABLE IF NOT EXISTS public.opportunity_saves (
  opportunity_id uuid        NOT NULL,
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, user_id)
);

CREATE INDEX IF NOT EXISTS opportunity_saves_user_idx
  ON public.opportunity_saves (user_id);

ALTER TABLE public.opportunity_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_opportunity_saves"
  ON public.opportunity_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_opportunity_saves"
  ON public.opportunity_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_opportunity_saves"
  ON public.opportunity_saves FOR DELETE
  USING (auth.uid() = user_id);


-- ── Notification Preferences ───────────────────────────────────────────────────
-- One row per user. Created on first GET with all defaults = true.
-- The cron and push sender respect these flags before acting.

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id         uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- In-app bell toggles
  inapp_deadlines boolean NOT NULL DEFAULT true,
  inapp_events    boolean NOT NULL DEFAULT true,
  inapp_system    boolean NOT NULL DEFAULT true,
  -- Email toggles
  email_deadlines boolean NOT NULL DEFAULT true,
  email_events    boolean NOT NULL DEFAULT true,
  -- Browser push toggles
  push_deadlines  boolean NOT NULL DEFAULT true,
  push_events     boolean NOT NULL DEFAULT true,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_prefs"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Realtime setup note ────────────────────────────────────────────────────────
-- IMPORTANT: After running this migration, enable Realtime for the notifications
-- table in Supabase Dashboard:
--   Database → Replication → Supabase Realtime → Tables → enable "notifications"
--
-- Without this the NotificationBell falls back to 30-second polling (still works
-- but not instant). Enabling Realtime = true live updates with no polling.
