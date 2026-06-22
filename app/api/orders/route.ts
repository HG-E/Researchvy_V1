import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { generateOrderReference, isEarlyBird, resolveAmount } from "@/lib/orders";
import { digitalVisibilityClinic } from "@/constants/clinics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicSlug, bundleId, moduleId, currency, userEmail, userName, userPhone, userId } = body as {
      clinicSlug: string;
      bundleId:   string;
      moduleId:   string | null;
      currency:   "ngn" | "usd";
      userEmail:  string;
      userName:   string;
      userPhone?: string;
      userId:     string | null;
    };

    if (!clinicSlug || !bundleId || !currency || !userEmail || !userName?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (bundleId === "solo" && !moduleId) {
      return NextResponse.json({ error: "Module selection required for solo purchase" }, { status: 400 });
    }
    if (bundleId === "solo" && moduleId) {
      const validSession = digitalVisibilityClinic.sessions.find((s) => s.id === moduleId && !s.isBonus);
      if (!validSession) {
        return NextResponse.json({ error: "Invalid module selection" }, { status: 400 });
      }
    }
    const validBundle = digitalVisibilityClinic.pricing.bundles.find((b) => b.id === bundleId);
    if (!validBundle && bundleId !== "solo") {
      return NextResponse.json({ error: "Invalid bundle" }, { status: 400 });
    }

    const earlyBird = isEarlyBird();
    const amount    = resolveAmount(bundleId, moduleId ?? null, currency, earlyBird);
    if (!amount) {
      return NextResponse.json({ error: "Invalid bundle or module" }, { status: 400 });
    }

    // If a userId is submitted, verify it matches the authenticated session.
    // This prevents guest requests from attaching orders to another user's account,
    // and prevents authenticated users from claiming orders under a different user ID.
    if (userId) {
      const sessionUser = await getServerUser();
      if (!sessionUser || sessionUser.id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const admin = createSupabaseAdminClient();

    if (userId) {
      const { data: existing } = await admin
        .from("orders")
        .select("id, status, order_number")
        .eq("user_id", userId)
        .eq("clinic_slug", clinicSlug)
        .eq("bundle_id", bundleId)
        .eq("module_id", moduleId ?? null)
        .neq("status", "cancelled")
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: `You already have an active order for this bundle (${existing.order_number}).`, orderId: existing.id },
          { status: 409 },
        );
      }
    }

    const reference = generateOrderReference();

    const { data, error } = await admin
      .from("orders")
      .insert({
        user_id:        userId ?? null,
        user_email:     userEmail,
        user_name:      userName.trim(),
        user_phone:     userPhone?.trim() || null,
        clinic_slug:    clinicSlug,
        bundle_id:      bundleId,
        module_id:      moduleId ?? null,
        currency,
        amount,
        is_early_bird:  earlyBird,
        payment_method: "bank_transfer",
        status:         "pending_payment",
        reference,
      })
      .select("id, order_number, reference")
      .single();

    if (error) {
      console.error("Order creation error:", error);
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id, orderNumber: data.order_number, reference: data.reference });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
