-- ── Notifications ──────────────────────────────────────────────────────────────
-- Stores per-user notification records. Inserted by server-side cron/admin only.
-- Read and update (mark-read) by the owning user via RLS.

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text        NOT NULL,  -- deadline_7d | deadline_1d | event_tomorrow | system | new_opportunity
  title      text        NOT NULL,
  body       text        NOT NULL,
  href       text,                  -- deep-link into the app
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications (user_id, read)
  WHERE read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only service role (admin client) may insert/delete
-- No INSERT/DELETE policy = only service_role bypass can write

-- ── Push Subscriptions ─────────────────────────────────────────────────────────
-- Browser Web Push subscriptions. One row per browser/device per user.

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint   text        NOT NULL UNIQUE,
  p256dh     text        NOT NULL,
  auth_key   text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx
  ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_push_subs"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_push_subs"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- ── Reminder idempotency ───────────────────────────────────────────────────────
-- Tracks which (opportunity, milestone) pairs have already had notifications sent
-- so the daily cron never double-notifies.

CREATE TABLE IF NOT EXISTS public.reminder_log (
  opportunity_id uuid NOT NULL,
  milestone      text NOT NULL,  -- '7d' | '1d'
  sent_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, milestone)
);

-- No RLS needed — admin client only
