-- ──────────────────────────────────────────────────────────────────────────────
-- 011_elearning_platform.sql
-- Researchvy Academy eLearning platform — courses, modules, lessons,
-- enrollments, and lesson-level progress tracking.
--
-- Hierarchy: level (1–5) → course → module → lesson
-- Enrollment is per course. Progress is per lesson.
--
-- IDEMPOTENT: safe to re-run if tables already exist.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── COURSES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
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
  -- estimated total duration in minutes
  duration_minutes INTEGER     NOT NULL DEFAULT 0,
  is_published     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_free          BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_level     ON courses (level, position);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses (is_published) WHERE is_published = TRUE;

-- ── MODULES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID        NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  position    SMALLINT    NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modules_course ON modules (course_id, position);

-- ── LESSONS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID        NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL,
  lesson_type      TEXT        NOT NULL DEFAULT 'video'
                               CHECK (lesson_type IN ('video', 'article', 'quiz', 'assignment')),
  video_id         TEXT,
  video_provider   TEXT        CHECK (video_provider IN ('youtube', 'bunny', 'external')),
  video_url        TEXT,
  content_md       TEXT,
  duration_seconds INTEGER     NOT NULL DEFAULT 0,
  position         SMALLINT    NOT NULL DEFAULT 1,
  is_free_preview  BOOLEAN     NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (module_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_lessons_module    ON lessons (module_id, position);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons (is_published) WHERE is_published = TRUE;

-- ── ENROLLMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  course_id    UUID        NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  tier         TEXT        NOT NULL DEFAULT 'starter',
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  source       TEXT        DEFAULT 'manual',
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user   ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (course_id);

-- ── LESSON PROGRESS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id            UUID        NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
  last_watched_seconds INTEGER     NOT NULL DEFAULT 0,
  watch_percent        SMALLINT    NOT NULL DEFAULT 0 CHECK (watch_percent BETWEEN 0 AND 100),
  completed_at         TIMESTAMPTZ,
  started_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user   ON lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress (lesson_id);

-- ── UPDATED_AT TRIGGERS ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses;
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER trg_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published courses"                    ON courses;
DROP POLICY IF EXISTS "public read modules of published courses"         ON modules;
DROP POLICY IF EXISTS "public read free preview lessons"                 ON lessons;
DROP POLICY IF EXISTS "enrolled users read all lessons in their courses" ON lessons;
DROP POLICY IF EXISTS "users read own enrollments"                       ON enrollments;
DROP POLICY IF EXISTS "users read own progress"                          ON lesson_progress;
DROP POLICY IF EXISTS "users upsert own progress"                        ON lesson_progress;
DROP POLICY IF EXISTS "users update own progress"                        ON lesson_progress;

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

CREATE POLICY "users read own enrollments"
  ON enrollments FOR SELECT
  USING (user_id = auth.uid());

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
CREATE OR REPLACE FUNCTION complete_lesson(p_lesson_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO lesson_progress (user_id, lesson_id, watch_percent, last_watched_seconds, completed_at)
  SELECT
    auth.uid(),
    p_lesson_id,
    100,
    COALESCE((SELECT duration_seconds FROM lessons WHERE id = p_lesson_id), 0),
    NOW()
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    watch_percent        = 100,
    last_watched_seconds = EXCLUDED.last_watched_seconds,
    completed_at         = COALESCE(lesson_progress.completed_at, NOW()),
    updated_at           = NOW();
END;
$$;

-- ── RPC: SAVE PROGRESS ────────────────────────────────────────────────────────
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
  WHERE lesson_progress.completed_at IS NULL;
END;
$$;
