import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const SLUG_RE = /^[a-z0-9-]{1,200}$/;

export async function POST(req: NextRequest) {
  try {
    // 10 share increments per IP per hour — shares happen infrequently; tight limit prevents abuse
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "article-share"), 10, 60 * 60 * 1000);
    if (!allowed) return NextResponse.json({ ok: true }); // silent — don't block the UI

    const { slug } = await req.json();
    if (!slug || typeof slug !== "string" || !SLUG_RE.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    await admin.rpc("increment_article_share", { p_slug: slug });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
