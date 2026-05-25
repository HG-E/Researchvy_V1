-- Academy programme interest / enquiry registration
CREATE TABLE IF NOT EXISTS public.academy_enquiries (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  programme_slug TEXT      NOT NULL DEFAULT 'research-visibility-academy',
  email        TEXT        NOT NULL,
  full_name    TEXT        NOT NULL DEFAULT '',
  notes        TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'contacted', 'enrolled', 'declined')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, programme_slug)
);

-- Enable Row Level Security
ALTER TABLE public.academy_enquiries ENABLE ROW LEVEL SECURITY;

-- Users can read their own enquiries
CREATE POLICY academy_enquiry_read_own
  ON public.academy_enquiries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own enquiries
CREATE POLICY academy_enquiry_insert_own
  ON public.academy_enquiries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for fast user-scoped lookups
CREATE INDEX IF NOT EXISTS academy_enquiries_user_id_idx
  ON public.academy_enquiries (user_id);
