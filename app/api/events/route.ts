import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getServerUser } from "@/lib/auth/supabase";
import { sendEventSubmitted } from "@/lib/email/index";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
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
  const slug = slugify(base);
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
  if (error) return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/events — authenticated event submission
export async function POST(req: NextRequest) {
  // 5 event submissions per IP per hour — prevents spam from compromised accounts
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "event-submit"), 5, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

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

  // Explicitly whitelist only user-settable fields — never spread body directly
  // to prevent clients from injecting is_featured, status, organizer_type, etc.
  const { data, error } = await admin
    .from("events")
    .insert({
      title:                    title.trim(),
      description:              description.trim(),
      short_description:        body.short_description?.trim()  || null,
      event_type,
      format,
      location:                 body.location?.trim()           || null,
      venue:                    body.venue?.trim()               || null,
      timezone:                 body.timezone                   ?? "UTC",
      start_date,
      end_date:                 body.end_date                   || null,
      registration_deadline:    body.registration_deadline      || null,
      featured_image:           body.featured_image?.trim()     || null,
      website_url:              body.website_url?.trim()        || null,
      registration_url:         body.registration_url?.trim()   || null,
      registration_type:        body.registration_type          ?? "external",
      capacity:                 body.capacity                   ?? null,
      is_free:                  body.is_free                    ?? true,
      fee_amount:               body.fee_amount                 ?? null,
      fee_currency:             body.fee_currency               ?? "USD",
      call_for_papers_url:      body.call_for_papers_url?.trim()       || null,
      call_for_papers_deadline: body.call_for_papers_deadline          || null,
      organizer_name:           organizer_name.trim(),
      organizer_email:          body.organizer_email?.trim()    || null,
      organizer_type:           "external",
      target_audience:          body.target_audience            ?? "all",
      disciplines:              Array.isArray(body.disciplines) ? body.disciplines : [],
      tags:                     Array.isArray(body.tags)        ? body.tags        : [],
      has_travel_funding:       body.has_travel_funding         ?? false,
      funding_description:      body.funding_description?.trim()       || null,
      funding_url:              body.funding_url?.trim()               || null,
      is_competitive_admission: body.is_competitive_admission  ?? false,
      application_url:          body.application_url?.trim()           || null,
      slug,
      status:                   "pending",
      is_featured:              false,
      submitted_by:             user.id,
    })
    .select("id,slug,title")
    .single();

  if (error) return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });

  // Confirmation email (fire-and-forget)
  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "";
  sendEventSubmitted(user.email!, firstName, title).catch(() => {});

  return NextResponse.json({ data }, { status: 201 });
}
