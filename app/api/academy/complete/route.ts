import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { checkLessonAccess } from "@/lib/academy/courses";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lesson_id } = await req.json();
    if (!lesson_id || typeof lesson_id !== "string") {
      return NextResponse.json({ error: "lesson_id required" }, { status: 400 });
    }

    // Verify user can actually access this lesson before marking it complete
    const allowed = await checkLessonAccess(user.id, lesson_id);
    if (!allowed) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // Must use the server client (user JWT) so auth.uid() resolves inside the RPC
    const { error } = await supabase.rpc("complete_lesson", { p_lesson_id: lesson_id });

    if (error) return NextResponse.json({ error: "Failed to mark lesson complete." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
