-- ── RLS Hardening v2 ─────────────────────────────────────────────────────────
-- After auditing all 29 existing migrations, the vast majority of tables already
-- have RLS + correct policies. This migration ONLY handles genuine gaps.
-- Safe to re-run: all statements are idempotent or wrapped in DO blocks.
-- ─────────────────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════════════════
-- 1. clinic_session_unlocks — fix incorrect public-read policy
--    This table has NO user_id column (it tracks cohort-level admin unlocks).
--    009_clinic_tasks set it to public-read (true) which is fine — it is just
--    session scheduling metadata with no PII. Ensure that policy is in place.
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.clinic_session_unlocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "unlocks_public_read"
    ON public.clinic_session_unlocks FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 2. texts — CMS rich-text blocks (not in any existing migration)
-- ══════════════════════════════════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE public.texts ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "texts_select_public"
    ON public.texts FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
        WHEN undefined_table   THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 3. opportunity_sources — auto-fetch config, admin-only (no user reads)
-- ══════════════════════════════════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- No user-facing SELECT policy: service role only via admin client.


-- ══════════════════════════════════════════════════════════════════════════════
-- 4. profiles — if a separate profiles table exists (some projects use one)
-- ══════════════════════════════════════════════════════════════════════════════
DO $$ BEGIN
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "profiles_select_public"
    ON public.profiles FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
        WHEN undefined_table   THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
        WHEN undefined_table   THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 5. Belt-and-suspenders: ensure orders always has a SELECT policy
--    (017_orders.sql adds it, 018_rls_hardening.sql also adds it — safe to repeat)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "orders_select_own"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- Already fully covered by existing migrations/001–029:
--   enrollments, lesson_progress, lesson_notes, certificates, event_saves,
--   clinic_enquiries, academy_enquiries, partnership_enquiries,
--   participant_task_progress, enrollment_drip_emails, newsletters,
--   visibility_scorecard_leads, users, events, event_registrations,
--   research_opportunities, courses, lessons, modules, clinic_session_tasks,
--   article_meta, notifications, push_subscriptions,
--   notification_preferences, opportunity_saves, reminder_log
-- ══════════════════════════════════════════════════════════════════════════════
