-- 017_orders.sql
-- Manual bank-transfer checkout: order tracking and enrollment confirmation

CREATE SEQUENCE IF NOT EXISTS orders_seq START 1;

CREATE TABLE IF NOT EXISTS orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT        UNIQUE NOT NULL,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email      TEXT        NOT NULL,
  user_name       TEXT        NOT NULL DEFAULT '',
  user_phone      TEXT,
  clinic_slug     TEXT        NOT NULL,
  cohort_id       TEXT        NOT NULL DEFAULT 'cohort-2026-july',
  bundle_id       TEXT        NOT NULL,          -- solo | core | pro
  module_id       TEXT,                          -- for solo: orcid | linkedin | wordpress
  currency        TEXT        NOT NULL DEFAULT 'ngn' CHECK (currency IN ('ngn', 'usd')),
  amount          INTEGER     NOT NULL,           -- full unit: naira or dollars
  is_early_bird   BOOLEAN     NOT NULL DEFAULT true,
  payment_method  TEXT        NOT NULL DEFAULT 'bank_transfer'
                              CHECK (payment_method IN ('bank_transfer', 'opay')),
  status          TEXT        NOT NULL DEFAULT 'pending_payment'
                              CHECK (status IN ('pending_payment', 'payment_submitted', 'confirmed', 'cancelled')),
  reference       TEXT        UNIQUE NOT NULL,   -- bank narration reference e.g. RVYDVC-AB12CD
  submitted_ref   TEXT,                          -- user-provided bank reference after transfer
  notes           TEXT,
  confirmed_at    TIMESTAMPTZ,
  confirmed_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.order_number := 'DVC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('orders_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_number ON orders;
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

CREATE OR REPLACE FUNCTION set_orders_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_orders_updated_at();

CREATE INDEX IF NOT EXISTS orders_user_id_idx    ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx     ON orders (status);
CREATE INDEX IF NOT EXISTS orders_reference_idx  ON orders (reference);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own_read" ON orders FOR SELECT USING (auth.uid() = user_id);
