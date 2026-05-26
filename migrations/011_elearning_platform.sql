-- ──────────────────────────────────────────────────────────────────────────────
-- 011_elearning_platform.sql
-- Researchvy Academy eLearning platform — courses, modules, lessons,
-- enrollments, and lesson-level progress tracking.
--
-- Hierarchy: level (1–5) → course → module → lesson
-- Enrollment is per course. Progress is per lesson.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── COURSES ──────────────────────────────────────────────────────────────────
CREATE TABLE courses (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  subtitle         TEXT,
  description      TEXT,
  level            SMALLINT    NOT NULL CHECK (level BETWEEN 1 AND 5),
  -- position within the level (1 = first course in that level)
  position         SMALLINT    NOT NULL DEFAULT 1,
  thumbnail_url    TEXT,
  trailer_url      TEXT,
  -- estimated total duration in minutes (auto-calculated by trigger, stored for perf)
  duration_minutes INTEGER     NOT NULL DEFAULT 0,
  is_published     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_free          BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_level     ON courses (level, position);
CREATE INDEX idx_courses_published ON courses (is_published) WHERE is_published = TRUE;

-- ── MODULES ──────────────────────────────────────────────────────────────────
-- A module is a named section within a course (e.g., "Week 1", "Foundation").
CREATE TABLE modules (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID        NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  position    SMALLINT    NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON modules (course_id, position);

-- ── LESSONS ──────────────────────────────────────────────────────────────────
CREATE TABLE lessons (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID        NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL,
  -- type: video | article | quiz | assignment
  lesson_type      TEXT        NOT NULL DEFAULT 'video'
                               CHECK (lesson_type IN ('video', 'article', 'quiz', 'assignment')),
  -- video hosting: YouTube video ID, Bunny.net video ID, or external URL
  video_id         TEXT,
  video_provider   TEXT        CHECK (video_provider IN ('youtube', 'bunny', 'external')),
  -- full URL for external or fallback
  video_url        TEXT,
  -- lesson body — markdown/MDX for article-type or supplementary notes
  content_md       TEXT,
  duration_seconds INTEGER     NOT NULL DEFAULT 0,
  position         SMALLINT    NOT NULL DEFAULT 1,
  -- free preview: non-enrolled users can watch this lesson
  is_free_preview  BOOLEAN     NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- slug unique per module (not globally, courses may reuse lesson names)
  UNIQUE (module_id, slug)
);

CREATE INDEX idx_lessons_module    ON lessons (module_id, position);
CREATE INDEX idx_lessons_published ON lessons (is_published) WHERE is_published = TRUE;

-- ── ENROLLMENTS ──────────────────────────────────────────────────────────────
-- One row per user per course. Tier records which pricing tier they paid for.
CREATE TABLE enrollments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  course_id    UUID        NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  -- tier: starter | builder | pro | institutional | complimentary
  tier         TEXT        NOT NULL DEFAULT 'starter',
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,                    -- NULL = lifetime access
  completed_at TIMESTAMPTZ,                    -- set when all lessons finished
  -- source of enrollment for analytics
  source       TEXT        DEFAULT 'manual',   -- manual | payment | clinic_alumni | admin
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user   ON enrollments (user_id);
CREATE INDEX idx_enrollments_course ON enrollments (course_id);

-- ── LESSON PROGRESS ───────────────────────────────────────────────────────────
-- One row per user per lesson. Created on first interaction, updated as they watch.
CREATE TABLE lesson_progress (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id            UUID        NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
  -- last known playhead position in seconds (for resume)
  last_watched_seconds INTEGER     NOT NULL DEFAULT 0,
  -- percentage 0–100 watched (set by client, capped server-side)
  watch_percent        SMALLINT    NOT NULL DEFAULT 0 CHECK (watch_percent BETWEEN 0 AND 100),
  completed_at         TIMESTAMPTZ,              -- NULL = in progress
  started_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user   ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress (lesson_id);

-- ── UPDATED_AT TRIGGERS ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS POLICIES ─────────────────────────────────────────────────────────────
ALTER TABLE courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Public can read published courses and modules
CREATE POLICY "public read published courses"
  ON courses FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "public read modules of published courses"
  ON modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id AND c.is_published = TRUE
    )
  );

-- Published lessons: public can read free previews; enrolled users read all
CREATE POLICY "public read free preview lessons"
  ON lessons FOR SELECT
  USING (is_published = TRUE AND is_free_preview = TRUE);

CREATE POLICY "enrolled users read all lessons in their courses"
  ON lessons FOR SELECT
  USING (
    is_published = TRUE
    AND EXISTS (
      SELECT 1
      FROM enrollments e
      JOIN modules m ON m.id = lessons.module_id
      WHERE e.user_id = auth.uid()
        AND e.course_id = m.course_id
        AND (e.expires_at IS NULL OR e.expires_at > NOW())
    )
  );

-- Enrollments: users see their own only
CREATE POLICY "users read own enrollments"
  ON enrollments FOR SELECT
  USING (user_id = auth.uid());

-- Lesson progress: users read and write their own only
CREATE POLICY "users read own progress"
  ON lesson_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "users upsert own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users update own progress"
  ON lesson_progress FOR UPDATE
  USING (user_id = auth.uid());

-- ── RPC: MARK LESSON COMPLETE ─────────────────────────────────────────────────
-- Atomic upsert that sets completed_at and watch_percent = 100.
-- Called from the lesson player when the user finishes a lesson.
CREATE OR REPLACE FUNCTION complete_lesson(p_lesson_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO lesson_progress (user_id, lesson_id, watch_percent, last_watched_seconds, completed_at)
  SELECT
    auth.uid(),
    p_lesson_id,
    100,
    COALESCE(
      (SELECT duration_seconds FROM lessons WHERE id = p_lesson_id),
      0
    ),
    NOW()
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    watch_percent        = 100,
    last_watched_seconds = EXCLUDED.last_watched_seconds,
    completed_at         = COALESCE(lesson_progress.completed_at, NOW()),
    updated_at           = NOW();
END;
$$;

-- ── RPC: SAVE PROGRESS ────────────────────────────────────────────────────────
-- Upsert playhead position without marking complete.
-- Called every ~30s from the lesson player.
CREATE OR REPLACE FUNCTION save_lesson_progress(
  p_lesson_id      UUID,
  p_seconds        INTEGER,
  p_watch_percent  SMALLINT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO lesson_progress (user_id, lesson_id, last_watched_seconds, watch_percent)
  VALUES (auth.uid(), p_lesson_id, p_seconds, p_watch_percent)
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    last_watched_seconds = GREATEST(lesson_progress.last_watched_seconds, EXCLUDED.last_watched_seconds),
    watch_percent        = GREATEST(lesson_progress.watch_percent, EXCLUDED.watch_percent),
    updated_at           = NOW()
  WHERE lesson_progress.completed_at IS NULL;  -- don't regress a completed lesson
END;
$$;
