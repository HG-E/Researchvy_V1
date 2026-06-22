import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

// GET /api/admin/events — full event list for admin panel
export async function GET(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("events")
    .select("id,title,slug,event_type,format,status,is_featured,organizer_name,organizer_type,start_date,submitted_by,reviewed_at,views_count,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) { console.error("[admin/events] GET", error.message); return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 }); }
  return NextResponse.json({ data });
}

// POST /api/admin/events — admin creates event directly (published immediately)
export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const admin = createSupabaseAdminClient();

  // Auto-slug
  function slugify(text: string) {
    return String(text).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  let slug = slugify(String(body.title ?? "event"));
  const { count } = await admin.from("events").select("id", { count: "exact", head: true }).eq("slug", slug);
  if (count) slug = `${slug}-${Date.now()}`;

  const { data, error } = await admin
    .from("events")
    .insert({
      ...body,
      slug,
      status: "published",
      submitted_by: user.id,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      organizer_type: body.organizer_type ?? "researchvy",
    })
    .select("id,slug,title")
    .single();

  if (error) { console.error("[admin/events] POST", error.message); return NextResponse.json({ error: "Failed to create event" }, { status: 500 }); }
  return NextResponse.json({ data }, { status: 201 });
}
