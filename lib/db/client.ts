import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

/**
 * Read a public env var, preferring the runtime-injected window.__ENV__ over
 * the build-time baked value. This lets Vercel inject real values even if the
 * build was done without them (e.g. first deploy before env vars were set).
 */
function getPublicEnv(key: string): string {
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  return (process.env[key] as string | undefined) ?? "";
}

function getSupabaseUrl()      { return getPublicEnv("NEXT_PUBLIC_SUPABASE_URL"); }
function getSupabaseAnonKey()  { return getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"); }

const supabaseUrl      = getSupabaseUrl();
const supabaseAnonKey  = getSupabaseAnonKey();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Auth features will fail."
  );
}

/** Browser/edge Supabase client (anon key — respects RLS). */
export const supabase = createClient(
  supabaseUrl  || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
