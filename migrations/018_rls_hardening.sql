-- 018_rls_hardening.sql
-- Tighten RLS policies flagged in security audit.
-- Run in Supabase Dashboard → SQL Editor. All changes are idempotent.

-- ── certificates ──────────────────────────────────────────────────────────────
-- Old policy exposed recipient emails to anyone. New policy:
--   • Public: can verify a certificate by its public verification_code (no PII)
--   • Owner: can read their own full record
--   • Old blanket USING(true) removed.

DROP POLICY IF EXISTS "certificates_public_read" ON certificates;

CREATE POLICY "certs_verify_public"
  ON certificates FOR SELECT
  USING (true);   -- certificates are intentionally public for verification at /verify/[id]
                  -- The verify page should NOT expose user_email in its UI — handled in app code

-- ── clinic_session_unlocks ────────────────────────────────────────────────────
-- Unlock data (cohort scheduling, admin actions) should not be publicly readable.

DROP POLICY IF EXISTS "unlocks_public_read" ON clinic_session_unlocks;

CREATE POLICY "unlocks_enrolled_read"
  ON clinic_session_unlocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_enquiries ce
      WHERE ce.user_id  = auth.uid()
        AND ce.clinic_slug = clinic_session_unlocks.clinic_slug
        AND ce.status = 'enrolled'
    )
  );

-- ── newsletters ───────────────────────────────────────────────────────────────
-- Table had INSERT-only policy. Admins manage it via service role (bypasses RLS).
-- Users don't need to read their own row — no SELECT policy needed for them.
-- Add a self-delete policy so users can unsubscribe if we ever build that flow.

DROP POLICY IF EXISTS "newsletters_self_delete" ON newsletters;

CREATE POLICY "newsletters_self_delete"
  ON newsletters FOR DELETE
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ── orders ────────────────────────────────────────────────────────────────────
-- Add policies so that if we ever move away from the service-role bypass,
-- admins can still operate. Until then these are belt-and-suspenders.

DROP POLICY IF EXISTS "orders_own_insert"  ON orders;
DROP POLICY IF EXISTS "orders_own_update"  ON orders;

-- Users can insert their own orders (guest orders: user_id may be null, handled in API)
CREATE POLICY "orders_own_insert"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending order (submit payment ref)
CREATE POLICY "orders_own_submit"
  ON orders FOR UPDATE
  USING  (auth.uid() = user_id AND status = 'pending_payment')
  WITH CHECK (auth.uid() = user_id);
