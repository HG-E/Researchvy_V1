-- Partnership / institutional enquiry capture
CREATE TABLE IF NOT EXISTS public.partnership_enquiries (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name     TEXT        NOT NULL,
  contact_email    TEXT        NOT NULL,
  institution      TEXT        NOT NULL DEFAULT '',
  researcher_count TEXT        NOT NULL DEFAULT '',
  interest_area    TEXT        NOT NULL DEFAULT '',
  message          TEXT,
  status           TEXT        NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS needed — inserts happen via service role key in API route
-- Admin reads via service role key in admin panel

CREATE INDEX IF NOT EXISTS partnership_enquiries_created_at_idx
  ON public.partnership_enquiries (created_at DESC);
