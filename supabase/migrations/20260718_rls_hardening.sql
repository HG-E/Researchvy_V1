-- ── RLS Hardening Migration ───────────────────────────────────────────────────
-- Ensures every table that holds per-user data is protected by Row Level Security.
-- All writes/admin reads go through the service-role client in API routes, which
-- bypasses RLS by design. RLS here protects against anyone using the anon key
-- (which is public) to query Supabase directly, bypassing the app's API.
--
-- Safe to re-run: ALTER TABLE ... ENABLE ROW LEVEL SECURITY is idempotent,
-- and policy names are unique so duplicate CREATE POLICY will error — wrap each
-- in a DO block that ignores "already exists" errors.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── HELPER: enable RLS idempotently ──────────────────────────────────────────
-- (ALTER TABLE ... ENABLE ROW LEVEL SECURITY is already idempotent in PG 15+)


-- ══════════════════════════════════════════════════════════════════════════════
-- 1.  ORDERS — financial records, most sensitive
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "orders_select_own"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Guest orders (user_id IS NULL) are created via admin client only.
-- Logged-in users can only see their own rows.


-- ══════════════════════════════════════════════════════════════════════════════
-- 2.  ENROLLMENTS — course access records
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "enrollments_select_own"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 3.  LESSON_PROGRESS — per-user learning progress
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "lesson_progress_select_own"
    ON public.lesson_progress FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "lesson_progress_insert_own"
    ON public.lesson_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "lesson_progress_update_own"
    ON public.lesson_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 4.  LESSON_NOTES — private notes written by the user
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "lesson_notes_all_own"
    ON public.lesson_notes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 5.  CERTIFICATES — completion certificates
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "certificates_select_own"
    ON public.certificates FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public certificate verification via /verify/[id] uses the admin client.


-- ══════════════════════════════════════════════════════════════════════════════
-- 6.  EVENT_SAVES — user bookmarked events
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.event_saves ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "event_saves_select_own"
    ON public.event_saves FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "event_saves_insert_own"
    ON public.event_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "event_saves_delete_own"
    ON public.event_saves FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 7.  CLINIC_ENQUIRIES — enquiry PII
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.clinic_enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "clinic_enquiries_select_own"
    ON public.clinic_enquiries FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "clinic_enquiries_insert_own"
    ON public.clinic_enquiries FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 8.  ACADEMY_ENQUIRIES — enquiry PII
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.academy_enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "academy_enquiries_select_own"
    ON public.academy_enquiries FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "academy_enquiries_insert_own"
    ON public.academy_enquiries FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 9.  PARTNERSHIP_ENQUIRIES — business lead PII (no user reads needed)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.partnership_enquiries ENABLE ROW LEVEL SECURITY;

-- No SELECT policy for users — only admin client reads these.
-- Anon INSERT allowed so non-logged-in visitors can submit partnership requests.
DO $$ BEGIN
  CREATE POLICY "partnership_enquiries_insert_anon"
    ON public.partnership_enquiries FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 10. CLINIC_SESSION_UNLOCKS — tracks which sessions a user has access to
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.clinic_session_unlocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "clinic_session_unlocks_select_own"
    ON public.clinic_session_unlocks FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 11. PARTICIPANT_TASK_PROGRESS — clinic task completion per user
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.participant_task_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "participant_task_progress_select_own"
    ON public.participant_task_progress FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "participant_task_progress_insert_own"
    ON public.participant_task_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "participant_task_progress_update_own"
    ON public.participant_task_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 12. ENROLLMENT_DRIP_EMAILS — internal drip tracking (no user reads)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.enrollment_drip_emails ENABLE ROW LEVEL SECURITY;

-- No user-facing policy: only service role inserts/reads these.


-- ══════════════════════════════════════════════════════════════════════════════
-- 13. NEWSLETTERS — subscriber list (no user reads; anon INSERT for subscribe)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "newsletters_insert_anon"
    ON public.newsletters FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 14. VISIBILITY_SCORECARD_LEADS — contact PII (no user reads)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.visibility_scorecard_leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "scorecard_leads_insert_anon"
    ON public.visibility_scorecard_leads FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 15. USERS (public profile table) — readable for public profiles
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Public SELECT: profile pages at /profile/[username] need this.
DO $$ BEGIN
  CREATE POLICY "users_select_public"
    ON public.users FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users can only update their own row.
DO $$ BEGIN
  CREATE POLICY "users_update_own"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- INSERT is handled by the signup trigger (service role), not by users directly.
-- DELETE is handled by admin client only.


-- ══════════════════════════════════════════════════════════════════════════════
-- 16. EVENTS — public catalog, no user writes
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "events_select_public"
    ON public.events FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 17. EVENT_REGISTRATIONS — registration records
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "event_registrations_select_own"
    ON public.event_registrations FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "event_registrations_insert_own"
    ON public.event_registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 18. RESEARCH_OPPORTUNITIES — public catalog, no user writes
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.research_opportunities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "research_opportunities_select_published"
    ON public.research_opportunities FOR SELECT
    USING (is_published = true OR auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Community submissions: authenticated users can insert (submission_status defaults to 'pending')
DO $$ BEGIN
  CREATE POLICY "research_opportunities_insert_auth"
    ON public.research_opportunities FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 19. COURSES / LESSONS / MODULES — public course catalog
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "courses_select_published"
    ON public.courses FOR SELECT
    USING (is_published = true OR auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "lessons_select_public"
    ON public.lessons FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "modules_select_public"
    ON public.modules FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 20. CLINIC_SESSION_TASKS — task definitions (public read; admin writes)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.clinic_session_tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "clinic_session_tasks_select_public"
    ON public.clinic_session_tasks FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 21. ARTICLE_META — CMS metadata (public read)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.article_meta ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "article_meta_select_published"
    ON public.article_meta FOR SELECT
    USING (is_published = true OR auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 22. TEXTS — CMS rich-text blocks (public read)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.texts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "texts_select_public"
    ON public.texts FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 23. OPPORTUNITY_SOURCES — auto-fetch source config (admin only)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;
-- No user-facing policy — service role only.


-- ══════════════════════════════════════════════════════════════════════════════
-- Already handled in previous migrations (kept here for completeness):
--   notifications              → 20260605_notifications.sql
--   push_subscriptions         → 20260605_notifications.sql
--   notification_preferences   → 20260605_notification_prefs.sql
--   opportunity_saves          → 20260605_notification_prefs.sql
--   reminder_log               → admin client only, no RLS needed
-- ══════════════════════════════════════════════════════════════════════════════
