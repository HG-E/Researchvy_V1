-- 021_level1_free.sql
-- Makes all Level 1 Academy courses fully free.
-- Previously only individual lessons could be marked free (is_free_preview).
-- This update unlocks all Level 1 lessons at the course level.
-- Run in Supabase Dashboard → SQL Editor.

UPDATE courses
SET    is_free = true
WHERE  level   = 1;
