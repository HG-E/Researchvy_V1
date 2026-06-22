import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { sendOpportunityApproved, sendOpportunityRejected } from "@/lib/email/index";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const caller = await getServerUser();
  if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { allowed } = await requireRole(caller.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, note } = await req.json() as { action: string; note?: string };
  const admin = createSupabaseAdminClient();

  let update: Record<string, unknown>;
  if (action === "publish") {
    update = { is_published: true, submission_status: "published" };
  } else if (action === "feature") {
    update = { is_published: true, submission_status: "published", is_featured: true };
  } else if (action === "unfeature") {
    update = { is_featured: false };
  } else if (action === "reject") {
    update = { is_published: false, submission_status: "rejected", review_note: note ?? null };
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const { data: opp, error: fetchErr } = await admin
    .from("research_opportunities")
    .select("id,title,submitted_by,submission_status")
    .eq("id", id)
    .single();
  if (fetchErr || !opp) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { error } = await admin
    .from("research_opportunities")
    .update(update)
    .eq("id", id);
  if (error) { console.error("[admin/opportunities/review] PATCH", error.message); return NextResponse.json({ error: "Failed to update opportunity status" }, { status: 500 }); }

  // Notify submitter if this was a community submission
  if (opp.submitted_by && (action === "publish" || action === "feature" || action === "reject")) {
    const { data: profile } = await admin
      .from("users")
      .select("email,full_name")
      .eq("id", opp.submitted_by)
      .single();
    if (profile?.email) {
      const firstName = profile.full_name?.split(" ")[0] ?? profile.email.split("@")[0];
      if (action === "publish" || action === "feature") {
        sendOpportunityApproved(profile.email, firstName, opp.title).catch(() => {});
      } else {
        sendOpportunityRejected(profile.email, firstName, opp.title, note ?? "").catch(() => {});
      }
    }
  }

  return NextResponse.json({ success: true });
}
