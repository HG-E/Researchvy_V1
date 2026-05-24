import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

async function signOut(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/signin`);
}

export const GET  = signOut;
export const POST = signOut;
