import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getServerUser } from "@/lib/auth/supabase";
import { sendEventSubmitted } from "@/lib/email/index";
import type { EventSubmitPayload } from "@/types/event";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string, admin: ReturnType<typeof createSupabaseAdminClient>): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { count } = await admin.from("events").select("id", { count: "exact", head: true }).eq("slug", candidate);
    if (!count) return candidate;
    suffix++;
  }
}

// GET /api/events — public listing (published + featured only)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type      = searchParams.get("type") ?? "";
  const format    = searchParams.get("format") ?? "";
  const audience  = searchParams.get("audience") ?? "";
  const upcoming  = searchParams.get("upcoming") === "true";
  const search    = searchParams.get("search") ?? "";
  const limit     = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset    = parseInt(searchParams.get("offset") ?? "0");

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("events")
    .select("id,title,slug,short_description,event_type,format,location,start_date,end_date,registration_deadline,featured_image,is_free,fee_amount,fee_currency,organizer_name,organizer_type,target_audience,disciplines,tags,status,is_featured,views_count,call_for_papers_deadline,capacity")
    .in("status", ["published", "featured"])
    .order("is_featured", { ascending: false })
    .order("start_date", { ascending: true })
    .range(offset, offset + limit - 1);

  if (type)     query = query.eq("event_type", type);
  if (format)   query = query.eq("format", format);
  if (audience) query = query.eq("target_audience", audience);
  if (upcoming) query = query.gte("start_date", new Date().toISOString());
  if (search)   query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/events — authenticated event submission
export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Sign in to submit an event." }, { status: 401 });

  let body: EventSubmitPayload;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const { title, description, event_type, format, start_date, organizer_name } = body;
  if (!title?.trim())          return NextResponse.json({ error: "Title is required." }, { status: 422 });
  if (!description?.trim())    return NextResponse.json({ error: "Description is required." }, { status: 422 });
  if (!event_type)             return NextResponse.json({ error: "Event type is required." }, { status: 422 });
  if (!format)                 return NextResponse.json({ error: "Format is required." }, { status: 422 });
  if (!start_date)             return NextResponse.json({ error: "Start date is required." }, { status: 422 });
  if (!organizer_name?.trim()) return NextResponse.json({ error: "Organizer name is required." }, { status: 422 });

  const admin = createSupabaseAdminClient();
  const slug  = await uniqueSlug(title, admin);

  const { data, error } = await admin
    .from("events")
    .insert({
      ...body,
      slug,
      status: "pending",
      submitted_by: user.id,
    })
    .select("id,slug,title")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Confirmation email (fire-and-forget)
  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "";
  sendEventSubmitted(user.email!, firstName, title).catch(() => {});

  return NextResponse.json({ data }, { status: 201 });
}
