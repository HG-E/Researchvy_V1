-- 008_clinic_preferred_track.sql
-- Captures the participant's chosen schedule track when registering interest
-- for a clinic cohort. Tracks run in parallel — same content, different days.

ALTER TABLE clinic_enquiries
  ADD COLUMN IF NOT EXISTS preferred_track TEXT
    CHECK (preferred_track IN ('wednesday', 'saturday'));
