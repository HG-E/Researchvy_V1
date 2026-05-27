import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

export async function POST(req: NextRequest) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const {
    module_id, title, slug, lesson_type,
    video_provider, video_id, video_url,
    content_md, duration_seconds, is_free_preview,
  } = await req.json() as {
    module_id: string; title: string; slug: string;
    lesson_type: string; video_provider?: string; video_id?: string;
    video_url?: string; content_md?: string; duration_seconds?: number;
    is_free_preview?: boolean;
  };

  if (!module_id || !title || !slug || !lesson_type) {
    return NextResponse.json({ error: "module_id, title, slug, and lesson_type are required" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { count } = await admin.from("lessons").select("id", { count: "exact", head: true }).eq("module_id", module_id);
  const position = (count ?? 0) + 1;

  const { data, error } = await admin.from("lessons").insert({
    module_id, title, slug,
    lesson_type,
    video_provider:   video_provider  ?? null,
    video_id:         video_id        ?? null,
    video_url:        video_url       ?? null,
    content_md:       content_md      ?? null,
    duration_seconds: duration_seconds ?? 0,
    is_free_preview:  is_free_preview ?? false,
    is_published:     false,
    position,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lesson: data }, { status: 201 });
}
