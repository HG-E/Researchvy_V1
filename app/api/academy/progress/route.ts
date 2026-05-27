import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { checkLessonAccess } from "@/lib/academy/courses";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lesson_id, seconds, watch_percent } = await req.json();
    if (!lesson_id || typeof seconds !== "number" || typeof watch_percent !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify user can actually access this lesson before recording progress
    const allowed = await checkLessonAccess(user.id, lesson_id);
    if (!allowed) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // Must use the server client (user JWT) so auth.uid() resolves inside the RPC
    await supabase.rpc("save_lesson_progress", {
      p_lesson_id:     lesson_id,
      p_seconds:       Math.max(0, Math.floor(seconds)),
      p_watch_percent: Math.min(100, Math.max(0, Math.floor(watch_percent))) as number,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
