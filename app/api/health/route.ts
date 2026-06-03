import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRole  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const urlSet  = supabaseUrl.startsWith("https://") && !supabaseUrl.includes("placeholder");
  const anonSet = supabaseAnon.length > 50;
  const svcSet  = serviceRole.length > 50;

  // Live connectivity test
  let supabaseReachable = false;
  let supabaseError = "";
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabaseAnon },
      signal: AbortSignal.timeout(5000),
    });
    supabaseReachable = res.ok;
    if (!res.ok) supabaseError = `HTTP ${res.status}`;
  } catch (e: unknown) {
    supabaseError = e instanceof Error ? e.message : "unknown error";
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL:      urlSet  ? "✅ set" : "❌ MISSING or placeholder",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonSet ? "✅ set" : "❌ MISSING or too short",
      SUPABASE_SERVICE_ROLE_KEY:     svcSet  ? "✅ set" : "❌ MISSING or too short",
      RESEND_API_KEY:                (process.env.RESEND_API_KEY ?? "").length > 10 ? "✅ set" : "❌ MISSING",
    },
    supabase: {
      reachable: supabaseReachable,
      error:     supabaseError || null,
    },
  });
}
