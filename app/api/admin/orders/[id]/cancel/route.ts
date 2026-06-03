import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { sendOrderCancelledEmail } from "@/lib/email/index";

export async function POST(
  request: NextRequest,
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

  const body = await request.json().catch(() => ({}));
  const reason: string = body.reason ?? "";

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("status,user_email,user_name,order_number,bundle_id,module_id,currency,amount")
    .eq("id", id)
    .single();

  if (orderErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "cancelled") return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  if (order.status === "confirmed") return NextResponse.json({ error: "Cannot cancel a confirmed order" }, { status: 400 });

  await admin
    .from("orders")
    .update({ status: "cancelled", notes: reason || null })
    .eq("id", id);

  sendOrderCancelledEmail({
    to:          order.user_email,
    userName:    order.user_name,
    orderNumber: order.order_number,
    reason,
  }).catch((err) => console.error("Cancel email failed:", err));

  return NextResponse.json({ success: true });
}
