-- Migration 026: Patch research_opportunities for community submissions + cross-linking
-- Adds: submitted_by, submission_status, review_note, linked_event_id, travel-grant category

-- 1. Add community-submission columns (backward-compatible: defaults keep existing rows working)
ALTER TABLE research_opportunities
  ADD COLUMN IF NOT EXISTS submitted_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS submission_status  TEXT NOT NULL DEFAULT 'published'
      CHECK (submission_status IN ('pending', 'published', 'rejected')),
  ADD COLUMN IF NOT EXISTS review_note        TEXT,
  ADD COLUMN IF NOT EXISTS linked_event_id    UUID REFERENCES events(id) ON DELETE SET NULL;

-- 2. Extend the category CHECK to include 'travel-grant'
--    Drop the old constraint, re-add with the extra value.
ALTER TABLE research_opportunities
  DROP CONSTRAINT IF EXISTS research_opportunities_category_check;

ALTER TABLE research_opportunities
  ADD CONSTRAINT research_opportunities_category_check
    CHECK (category IN ('grant','fellowship','conference','speaking','collaboration','job','award','travel-grant','other'));

-- 3. Index for pending submissions review queue
CREATE INDEX IF NOT EXISTS idx_research_opportunities_submission_status
  ON research_opportunities(submission_status);

CREATE INDEX IF NOT EXISTS idx_research_opportunities_submitted_by
  ON research_opportunities(submitted_by);

CREATE INDEX IF NOT EXISTS idx_research_opportunities_linked_event
  ON research_opportunities(linked_event_id);

-- 4. RLS update: public can read published rows; submitters can read/update their own pending rows
--    (existing "anyone can select published" policy must be broadened)

-- Drop existing read policy if it only checked is_published
DROP POLICY IF EXISTS "Public can view published opportunities" ON research_opportunities;
DROP POLICY IF EXISTS "Anyone can view published opportunities" ON research_opportunities;

-- New public read: published ones (is_published = true AND submission_status = 'published') OR own pending
CREATE POLICY "Public read published opportunities"
  ON research_opportunities FOR SELECT
  USING (
    (is_published = true AND submission_status = 'published')
    OR (auth.uid() IS NOT NULL AND submitted_by = auth.uid())
  );

-- Authenticated users can insert their own submissions (they arrive as pending)
DROP POLICY IF EXISTS "Auth users can submit opportunities" ON research_opportunities;

CREATE POLICY "Auth users can submit opportunities"
  ON research_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND submission_status = 'pending');

-- Submitters can update their own pending submissions (before admin review)
DROP POLICY IF EXISTS "Submitters can update own pending" ON research_opportunities;

CREATE POLICY "Submitters can update own pending"
  ON research_opportunities FOR UPDATE
  TO authenticated
  USING (submitted_by = auth.uid() AND submission_status = 'pending');
