-- 019_certificate_sequence.sql
-- Replace COUNT-based certificate numbering with a Postgres SEQUENCE.
-- Two concurrent cert issuances using COUNT() could get the same number
-- and produce a duplicate certificate_number (UNIQUE constraint violation).
-- A SEQUENCE is atomic and guaranteed unique across concurrent requests.
-- Run in Supabase Dashboard → SQL Editor.

CREATE SEQUENCE IF NOT EXISTS cert_seq START 1;

-- Expose the sequence via an RPC so the service role can call it from Next.js
CREATE OR REPLACE FUNCTION nextval_cert_seq()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nextval('cert_seq');
$$;
