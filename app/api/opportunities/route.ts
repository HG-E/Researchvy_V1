import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { sendOpportunitySubmitted } from "@/lib/email/index";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import type { OpportunitySubmitPayload } from "@/types/opportunity";

// GET /api/opportunities — public listing (published only)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category  = searchParams.get("category") ?? "";
  const level     = searchParams.get("level") ?? "";
  const search    = searchParams.get("search") ?? "";
  const upcoming  = searchParams.get("upcoming") === "true";
  const limit     = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset    = parseInt(searchParams.get("offset") ?? "0");

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("research_opportunities")
    .select("id,title,body,category,funder,value,deadline,apply_url,target_level,is_featured,auto_fetched,source_url,created_at,submission_status,linked_event_id")
    .eq("is_published", true)
    .eq("submission_status", "published")
    .order("is_featured", { ascending: false })
    .order("deadline", { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (category)  query = query.eq("category", category);
  if (level)     query = query.eq("target_level", level);
  if (upcoming)  query = query.gte("deadline", new Date().toISOString().split("T")[0]);
  if (search)    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%,funder.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to load opportunities." }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/opportunities — authenticated community submission
export async function POST(req: NextRequest) {
  // 5 opportunity submissions per IP per hour
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "opp-submit"), 5, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Sign in to submit an opportunity." }, { status: 401 });

  let body: OpportunitySubmitPayload;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const { title, body: desc, category, apply_url } = body;
  if (!title?.trim())     return NextResponse.json({ error: "Title is required." }, { status: 422 });
  if (!desc?.trim())      return NextResponse.json({ error: "Description is required." }, { status: 422 });
  if (!category)          return NextResponse.json({ error: "Category is required." }, { status: 422 });
  if (!apply_url?.trim()) return NextResponse.json({ error: "Application URL is required." }, { status: 422 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("research_opportunities")
    .insert({
      title:             title.trim(),
      body:              desc.trim(),
      category,
      funder:            body.funder?.trim()   || null,
      value:             body.value?.trim()    || null,
      deadline:          body.deadline         || null,
      apply_url:         apply_url.trim(),
      target_level:      body.target_level     ?? "all",
      is_published:      false,
      submission_status: "pending",
      submitted_by:      user.id,
      auto_fetched:      false,
    })
    .select("id,title")
    .single();

  if (error) return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "";
  sendOpportunitySubmitted(user.email!, firstName, title).catch(() => {});

  return NextResponse.json({ data }, { status: 201 });
}
