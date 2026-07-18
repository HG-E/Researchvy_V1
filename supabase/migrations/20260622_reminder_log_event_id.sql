-- Item 38: reminder_log reused opportunity_id for event IDs — add a proper event_id column
-- opportunity_id becomes nullable (used only for opportunity reminders)
-- event_id added for event reminders
-- Unique indexes enforce one reminder per entity+milestone combination

ALTER TABLE reminder_log ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE reminder_log ALTER COLUMN opportunity_id DROP NOT NULL;

-- Separate unique constraints for opps vs events
CREATE UNIQUE INDEX IF NOT EXISTS reminder_log_event_milestone_idx
  ON reminder_log (event_id, milestone)
  WHERE event_id IS NOT NULL;
