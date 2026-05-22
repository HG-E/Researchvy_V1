/**
 * Environment variable validation.
 * Import this at the top of server-only modules to catch missing config early.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optionalEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

// ── Public (safe to expose to browser) ──────────────────────────────────────
export const publicEnv = {
  supabaseUrl:      optionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey:  optionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  siteUrl:          optionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  posthogKey:       optionalEnv("NEXT_PUBLIC_POSTHOG_KEY"),
  posthogHost:      optionalEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://app.posthog.com"),
};

// ── Server-only (never expose to browser) ───────────────────────────────────
export function getServerEnv() {
  return {
    supabaseServiceKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    resendApiKey:       requireEnv("RESEND_API_KEY"),
    resendFromEmail:    optionalEnv("RESEND_FROM_EMAIL", "hello@researchvy.com"),
  };
}
