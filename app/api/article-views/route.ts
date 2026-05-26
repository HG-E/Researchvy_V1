import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }
    const admin = createSupabaseAdminClient();
    await admin.rpc("increment_article_view", { p_slug: slug });
    return NextResponse.json({ ok: true });
  } catch {
    // Silent fail — analytics should never break the page
    return NextResponse.json({ ok: true });
  }
}
