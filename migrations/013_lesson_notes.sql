-- Lesson notes: one row per user per lesson, upserted on save.
-- Run once in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS lesson_notes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id  UUID        NOT NULL REFERENCES lessons (id)    ON DELETE CASCADE,
  content    TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own notes"
  ON lesson_notes FOR ALL TO authenticated
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
