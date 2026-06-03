import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, order_number, reference, bundle_id, module_id, currency, amount, is_early_bird, status, payment_method, submitted_ref, created_at, user_name, user_email, clinic_slug",
      )
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
