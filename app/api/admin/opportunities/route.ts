import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function guard() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

export async function GET() {
  const caller = await guard();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("id,title,category,funder,value,deadline,apply_url,body,is_published,is_featured,target_level,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const caller = await guard();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.title?.trim() || !body.apply_url?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "title, apply_url, and body are required" }, { status: 400 });
  }
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("research_opportunities")
    .insert({
      title:             body.title.trim(),
      body:              body.body.trim(),
      category:          body.category ?? "other",
      funder:            body.funder?.trim() || null,
      value:             body.value?.trim()  || null,
      deadline:          body.deadline       || null,
      apply_url:         body.apply_url.trim(),
      target_level:      body.target_level ?? "all",
      is_published:      body.is_published  ?? false,
      is_featured:       body.is_featured   ?? false,
      submission_status: "published",
    })
    .select("id")
    .single();
  if (error) { console.error("[admin/opportunities] POST", error.message); return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 }); }
  return NextResponse.json({ id: data.id });
}
