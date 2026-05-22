import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";

if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
  // Warn at startup but don't throw — allows the app to render during local setup
  console.warn(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Database features will be unavailable."
  );
}

/** Browser/edge Supabase client (anon key — respects RLS). */
export const supabase = createClient(
  publicEnv.supabaseUrl  || "https://placeholder.supabase.co",
  publicEnv.supabaseAnonKey || "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
