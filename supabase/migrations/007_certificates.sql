-- 007_certificates.sql
-- Certificate of Scholarly Visibility Practice
-- Issued by admin when a clinic participant completes the programme

CREATE TABLE IF NOT EXISTS certificates (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT         UNIQUE NOT NULL,          -- e.g. RVC-2025-00001
  user_id            UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  enquiry_id         UUID,                                   -- loose FK to clinic_enquiries
  recipient_name     TEXT         NOT NULL,
  recipient_email    TEXT         NOT NULL,
  programme          TEXT         NOT NULL DEFAULT 'Digital Visibility Clinic',
  clinic_slug        TEXT         NOT NULL DEFAULT 'digital-visibility-clinic',
  issued_by          TEXT,                                   -- admin email
  issued_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Anyone can read (needed for public /verify page)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_public_read" ON certificates
  FOR SELECT USING (true);

-- Only service role can insert/update (enforced via API route using admin client)
-- No INSERT policy needed — the API uses the service role key which bypasses RLS
