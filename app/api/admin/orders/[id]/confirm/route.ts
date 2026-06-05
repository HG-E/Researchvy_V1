import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { sendOrderConfirmedEmail } from "@/lib/email/index";
import { notifyEnrollmentConfirmed } from "@/lib/notifications/whatsapp";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const caller = await getServerUser();
  if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { allowed } = await requireRole(caller.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createSupabaseAdminClient();

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id,user_id,user_email,user_name,order_number,bundle_id,module_id,currency,amount,status,clinic_slug")
    .eq("id", id)
    .single();

  if (orderErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "confirmed") return NextResponse.json({ error: "Already confirmed" }, { status: 400 });

  // Atomic update: only succeeds if status is still not "confirmed" — prevents double-confirm race condition
  const { data: updatedRows, error: updateErr } = await admin
    .from("orders")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: caller.id })
    .eq("id", id)
    .neq("status", "confirmed")
    .select("id");

  if (updateErr) return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  if (!updatedRows || updatedRows.length === 0) {
    return NextResponse.json({ error: "Already confirmed by another admin" }, { status: 400 });
  }

  if (order.user_id) {
    const { data: existing } = await admin
      .from("clinic_enquiries")
      .select("id")
      .eq("user_id", order.user_id)
      .eq("clinic_slug", order.clinic_slug)
      .maybeSingle();

    if (existing) {
      await admin
        .from("clinic_enquiries")
        .update({ status: "enrolled" })
        .eq("id", existing.id);
    } else {
      await admin.from("clinic_enquiries").insert({
        user_id:     order.user_id,
        clinic_slug: order.clinic_slug,
        email:       order.user_email,
        full_name:   order.user_name,
        notes:       `Enrolled via order ${order.order_number}`,
        status:      "enrolled",
      });
    }
  }

  sendOrderConfirmedEmail({
    to:          order.user_email,
    userName:    order.user_name,
    orderNumber: order.order_number,
    bundleId:    order.bundle_id,
    moduleId:    order.module_id,
    currency:    order.currency,
    amount:      order.amount,
  }).catch((err) => console.error("Receipt email failed:", err));

  // WhatsApp enrollment confirmation — no-ops if AT not configured
  const { data: fullOrder } = await admin.from("orders").select("user_phone").eq("id", id).single();
  void notifyEnrollmentConfirmed({
    phone:        (fullOrder as { user_phone?: string | null } | null)?.user_phone ?? null,
    userName:     order.user_name,
    orderNumber:  order.order_number,
    bundleName:   order.bundle_id,
    dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com"}/dashboard/clinics`,
  });

  // Schedule the 4 post-enrollment onboarding drip emails
  const now = new Date();
  const day = (n: number) => new Date(now.getTime() + n * 86_400_000).toISOString();
  admin.from("enrollment_drip_emails").insert([
    { order_id: id, user_email: order.user_email, email_type: "cohort_prep",       scheduled_for: day(1)  },
    { order_id: id, user_email: order.user_email, email_type: "meet_cohort",        scheduled_for: day(3)  },
    { order_id: id, user_email: order.user_email, email_type: "session1_reminder",  scheduled_for: day(7)  },
    { order_id: id, user_email: order.user_email, email_type: "what_to_prepare",    scheduled_for: day(12) },
  ]).then(() => {}, (e: unknown) => console.error("Drip schedule failed:", e));

  return NextResponse.json({ success: true });
}
