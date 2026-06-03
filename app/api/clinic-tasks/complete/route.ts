import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { allowed } = await checkRateLimit(`task-complete:${user.id}`, 60, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const { task_id, completed, reflection } = body as {
    task_id:     string;
    completed:   boolean;
    reflection?: string;
  };

  if (!task_id || typeof completed !== "boolean") {
    return NextResponse.json({ error: "task_id and completed are required" }, { status: 400 });
  }
  if (reflection && reflection.length > 5000) {
    return NextResponse.json({ error: "Reflection too long (max 5 000 characters)" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Verify task exists and belongs to a real clinic/session
  const { data: task } = await admin
    .from("clinic_session_tasks")
    .select("session_number, clinic_slug")
    .eq("id", task_id)
    .single();

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  // Verify user is enrolled in the clinic this task belongs to
  const { data: enrolment } = await admin
    .from("clinic_enquiries")
    .select("status")
    .eq("user_id", user.id)
    .eq("clinic_slug", task.clinic_slug)
    .eq("status", "enrolled")
    .maybeSingle();

  if (!enrolment) return NextResponse.json({ error: "Not enrolled in this clinic" }, { status: 403 });

  // Verify the session is actually unlocked (prevents completing future locked sessions via API)
  const { data: unlock } = await admin
    .from("clinic_session_unlocks")
    .select("id")
    .eq("clinic_slug", task.clinic_slug)
    .eq("session_number", task.session_number)
    .maybeSingle();

  if (!unlock) return NextResponse.json({ error: "This session is not unlocked yet" }, { status: 403 });

  if (completed) {
    const { error } = await admin
      .from("participant_task_progress")
      .upsert(
        { user_id: user.id, task_id, reflection: reflection ?? null },
        { onConflict: "user_id,task_id" },
      );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await admin
      .from("participant_task_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("task_id", task_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
