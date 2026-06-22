import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { sendEventApproved, sendEventRejected } from "@/lib/email/index";

type ReviewAction = "publish" | "feature" | "reject" | "archive" | "cancel" | "unfeature";

// PATCH /api/admin/events/[id]/review — admin review actions
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  let body: { action: ReviewAction; note?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const { action, note } = body;

  const STATUS_MAP: Record<ReviewAction, string> = {
    publish:  "published",
    feature:  "featured",
    reject:   "rejected",
    archive:  "archived",
    cancel:   "cancelled",
    unfeature: "published",
  };

  const newStatus = STATUS_MAP[action];
  if (!newStatus) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const admin = createSupabaseAdminClient();

  // Fetch event to get submitter email for notifications
  const { data: event } = await admin
    .from("events")
    .select("id,title,slug,status,submitted_by")
    .eq("id", id)
    .single();

  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const { data, error } = await admin
    .from("events")
    .update({
      status: newStatus,
      is_featured: action === "feature",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      ...(note ? { review_note: note } : {}),
    })
    .eq("id", id)
    .select("id,slug,status")
    .single();

  if (error) { console.error("[admin/events/review] PATCH", error.message); return NextResponse.json({ error: "Failed to update event status" }, { status: 500 }); }

  // Notify submitter of approval or rejection
  if (event.submitted_by && (action === "publish" || action === "feature")) {
    const { data: submitter } = await admin
      .from("users")
      .select("email,full_name")
      .eq("id", event.submitted_by)
      .single();
    if (submitter?.email) {
      await sendEventApproved(submitter.email, submitter.full_name, event.title, event.slug).catch(() => {});
    }
  }

  if (event.submitted_by && action === "reject") {
    const { data: submitter } = await admin
      .from("users")
      .select("email,full_name")
      .eq("id", event.submitted_by)
      .single();
    if (submitter?.email) {
      await sendEventRejected(submitter.email, submitter.full_name, event.title, note ?? "").catch(() => {});
    }
  }

  return NextResponse.json({ data });
}
