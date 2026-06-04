import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { sendOrderSubmittedAdminAlert, sendPaymentReceivedEmail } from "@/lib/email/index";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { notifyPaymentReceived } from "@/lib/notifications/whatsapp";

function bundleLabel(bundleId: string, moduleId: string | null): string {
  if (bundleId === "solo" && moduleId) {
    const s = digitalVisibilityClinic.sessions.find((x) => x.id === moduleId);
    return s ? `${s.name} — Single Module` : "Single Module";
  }
  return digitalVisibilityClinic.pricing.bundles.find((b) => b.id === bundleId)?.name ?? bundleId;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const submittedRef: string | null = body.submittedRef ?? null;

    const admin = createSupabaseAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("user_id,status,user_name,user_email,user_phone,order_number,bundle_id,module_id,currency,amount,reference")
      .eq("id", id)
      .single();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (order.status !== "pending_payment") {
      return NextResponse.json({ error: "Order cannot be updated" }, { status: 400 });
    }

    const { error } = await admin
      .from("orders")
      .update({ status: "payment_submitted", submitted_ref: submittedRef })
      .eq("id", id);

    if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

    const bundleName = bundleLabel(order.bundle_id, order.module_id);

    sendOrderSubmittedAdminAlert({
      orderNumber:  order.order_number,
      userName:     order.user_name,
      userEmail:    order.user_email,
      userPhone:    order.user_phone ?? null,
      bundleName,
      currency:     order.currency,
      amount:       order.amount,
      reference:    order.reference,
      submittedRef,
      orderId:      id,
    }).catch((err) => console.error("Admin alert email failed:", err));

    sendPaymentReceivedEmail({
      to:           order.user_email,
      userName:     order.user_name,
      orderNumber:  order.order_number,
      bundleName,
      currency:     order.currency,
      amount:       order.amount,
      reference:    order.reference,
      submittedRef,
    }).catch((err) => console.error("Payment received email failed:", err));

    // WhatsApp notification — silently no-ops if Africa's Talking not configured
    notifyPaymentReceived({
      phone:       order.user_phone ?? null,
      userName:    order.user_name,
      orderNumber: order.order_number,
      reference:   order.reference,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
