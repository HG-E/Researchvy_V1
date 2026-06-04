-- 023_referrals.sql
-- Referral system: alumni share a code, earn 5% commission when someone enrolls.
-- Run in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS referral_codes (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code        TEXT  UNIQUE NOT NULL,          -- e.g. "HILLARY5"
  uses        INT   NOT NULL DEFAULT 0,
  earnings_ngn NUMERIC(10,2) NOT NULL DEFAULT 0,
  earnings_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_email   TEXT  NOT NULL,
  order_id        UUID  REFERENCES orders(id) ON DELETE SET NULL,
  commission_ngn  NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission_usd  NUMERIC(10,2) NOT NULL DEFAULT 0,
  status          TEXT  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','void')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users can read their own referral code and history
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rc_own_read"   ON referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ref_own_read"  ON referrals       FOR SELECT USING (auth.uid() = referrer_id);
