import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// POST — create a module inside a course
export async function POST(req: NextRequest) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { course_id, title, description } = await req.json() as {
    course_id: string; title: string; description?: string;
  };
  if (!course_id || !title) return NextResponse.json({ error: "course_id and title are required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { count } = await admin.from("modules").select("id", { count: "exact", head: true }).eq("course_id", course_id);
  const position = (count ?? 0) + 1;

  const { data, error } = await admin.from("modules").insert({
    course_id, title, description: description ?? null, position,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ module: data }, { status: 201 });
}
