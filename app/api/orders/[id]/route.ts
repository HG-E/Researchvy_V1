import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, order_number, reference, bundle_id, module_id, currency, amount, is_early_bird, status, payment_method, submitted_ref, created_at, user_name, user_email, user_id, clinic_slug",
      )
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
