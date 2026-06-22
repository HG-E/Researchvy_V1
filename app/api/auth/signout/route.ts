import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

// POST only — never GET. A GET handler would allow logout CSRF via <img src="/api/auth/signout">
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/signin`);
}
