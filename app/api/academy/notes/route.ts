import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

async function getUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET /api/academy/notes?lesson_id=xxx
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lesson_id = req.nextUrl.searchParams.get("lesson_id");
  if (!lesson_id) return NextResponse.json({ error: "lesson_id required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("lesson_notes")
    .select("content, updated_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson_id)
    .maybeSingle();

  return NextResponse.json({ note: data ?? null });
}

// PUT /api/academy/notes  { lesson_id, content }
export async function PUT(req: NextRequest) {
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "notes-put"), 60, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lesson_id, content } = await req.json() as { lesson_id?: string; content?: string };
  if (!lesson_id || typeof content !== "string") {
    return NextResponse.json({ error: "lesson_id and content required" }, { status: 400 });
  }
  if (content.length > 20_000) {
    return NextResponse.json({ error: "Note too long (max 20 000 characters)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("lesson_notes").upsert(
    { user_id: user.id, lesson_id, content, updated_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) return NextResponse.json({ error: "Failed to save note." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
