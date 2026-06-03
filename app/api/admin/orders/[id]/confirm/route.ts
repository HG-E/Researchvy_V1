import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { sendOrderConfirmedEmail } from "@/lib/email/index";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const caller = await getServerUser();
  if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: callerRow } = await admin
    .from("users")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (!callerRow || callerRow.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "confirmed") return NextResponse.json({ error: "Already confirmed" }, { status: 400 });

  await admin
    .from("orders")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: caller.id })
    .eq("id", id);

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
        user_id:    order.user_id,
        clinic_slug: order.clinic_slug,
        email:      order.user_email,
        full_name:  order.user_name,
        notes:      `Enrolled via order ${order.order_number}`,
        status:     "enrolled",
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

  return NextResponse.json({ success: true });
}
