import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

// GET /api/users/[username]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const admin = createSupabaseAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select(
      "id, full_name, avatar_url, bio, orcid, google_scholar, institutional_affiliation, role, username, profile_public, created_at"
      // email intentionally excluded
    )
    .eq("username", username.toLowerCase())
    .eq("profile_public", true)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const [{ data: certificates }, { data: opportunities }, { data: events }] = await Promise.all([
    admin
      .from("certificates")
      .select("id, certificate_number, recipient_name, programme, clinic_slug, issued_at")
      .eq("user_id", profile.id)
      .order("issued_at", { ascending: false })
      .limit(20),

    admin
      .from("research_opportunities")
      .select("id, title, body, category, funder, value, deadline, apply_url, target_level, is_featured, linked_event_id")
      .eq("submitted_by", profile.id)
      .eq("is_published", true)
      .eq("submission_status", "published")
      .order("created_at", { ascending: false })
      .limit(12),

    admin
      .from("events")
      .select("id, title, slug, short_description, event_type, format, location, start_date, end_date, registration_deadline, featured_image, is_free, fee_amount, fee_currency, organizer_name, organizer_type, target_audience, disciplines, tags, status, is_featured, views_count, call_for_papers_deadline, capacity, has_travel_funding, is_competitive_admission, registration_type")
      .eq("submitted_by", profile.id)
      .in("status", ["published", "featured"])
      .order("start_date", { ascending: false })
      .limit(12),
  ]);

  return NextResponse.json({
    profile,
    certificates:  certificates  ?? [],
    opportunities: opportunities ?? [],
    events:        events        ?? [],
  });
}
