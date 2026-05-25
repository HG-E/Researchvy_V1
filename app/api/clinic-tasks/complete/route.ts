import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { task_id, completed, reflection } = body as {
    task_id:     string;
    completed:   boolean;
    reflection?: string;
  };

  if (!task_id || typeof completed !== "boolean") {
    return NextResponse.json({ error: "task_id and completed are required" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  if (completed) {
    const { error } = await admin
      .from("participant_task_progress")
      .upsert(
        { user_id: user.id, task_id, reflection: reflection ?? null },
        { onConflict: "user_id,task_id" }
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
