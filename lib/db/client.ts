import { createBrowserClient } from "@supabase/ssr";

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

function getPublicEnv(key: string): string {
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  return (process.env[key] as string | undefined) ?? "";
}

/**
 * Browser Supabase client using @supabase/ssr.
 * Reads and writes the session from cookies, so it stays in sync with
 * the server-side session set by the signin/signup API routes.
 * This is the correct client to use in "use client" components.
 */
export const supabase = createBrowserClient(
  getPublicEnv("NEXT_PUBLIC_SUPABASE_URL")  || "https://placeholder.supabase.co",
  getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || "placeholder"
);
