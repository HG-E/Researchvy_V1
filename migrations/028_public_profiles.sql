-- 028_public_profiles.sql
-- Adds username (unique public slug) and profile_public toggle to users.
-- Enables public researcher profile pages at /profile/[username].

-- 1. New columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS username       TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS profile_public BOOLEAN NOT NULL DEFAULT true;

-- 2. Case-insensitive uniqueness guard (prevents jane-smith and Jane-Smith coexisting)
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower
  ON public.users (lower(username))
  WHERE username IS NOT NULL;

-- 3. Fast index for public profile page lookups
CREATE INDEX IF NOT EXISTS users_username_public
  ON public.users (username, profile_public)
  WHERE username IS NOT NULL AND profile_public = true;

-- 4. RLS: allow anonymous readers to SELECT public profiles
DROP POLICY IF EXISTS "users_public_profile_read" ON public.users;
CREATE POLICY "users_public_profile_read"
  ON public.users FOR SELECT TO anon
  USING (profile_public = true AND username IS NOT NULL);

-- 5. Authenticated users can read and update their own row
DROP POLICY IF EXISTS "users_own_read" ON public.users;
CREATE POLICY "users_own_read"
  ON public.users FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "users_own_update" ON public.users;
CREATE POLICY "users_own_update"
  ON public.users FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
