import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { PAYMENT_CONFIG } from "@/constants/payment";
import { PaymentClient } from "./PaymentClient";

export const metadata = generatePageMetadata({ title: "Order Confirmation", noIndex: true });
export const dynamic  = "force-dynamic";

type Order = {
  id:            string;
  user_id:       string | null;
  order_number:  string;
  reference:     string;
  bundle_id:     string;
  module_id:     string | null;
  currency:      "ngn" | "usd";
  amount:        number;
  is_early_bird: boolean;
  status:        "pending_payment" | "payment_submitted" | "confirmed" | "cancelled";
  payment_method: string;
  submitted_ref:  string | null;
  created_at:    string;
  user_name:     string;
  user_email:    string;
};

async function getOrder(id: string): Promise<Order | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id,user_id,order_number,reference,bundle_id,module_id,currency,amount,is_early_bird,status,payment_method,submitted_ref,created_at,user_name,user_email",
      )
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as Order;
  } catch {
    return null;
  }
}

function bundleLabel(bundleId: string, moduleId: string | null): string {
  if (bundleId === "solo" && moduleId) {
    const s = digitalVisibilityClinic.sessions.find((x) => x.id === moduleId);
    return s ? `${s.name} — Single Module` : "Single Module";
  }
  return digitalVisibilityClinic.pricing.bundles.find((b) => b.id === bundleId)?.name ?? bundleId;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const [order, user] = await Promise.all([getOrder(orderId), getServerUser()]);
  if (!order) notFound();
  if (!user) redirect(`/signin?next=/clinics/checkout/${orderId}`);
  if (!order.user_id || order.user_id !== user.id) notFound();

  const bundleName      = bundleLabel(order.bundle_id, order.module_id);
  const formattedAmount =
    order.currency === "ngn"
      ? `₦${order.amount.toLocaleString("en-NG")}`
      : `$${order.amount} USD`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/clinics/digital-visibility-clinic"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Clinic
        </Link>

        <PaymentClient
          order={order}
          bundleName={bundleName}
          formattedAmount={formattedAmount}
          bankDetails={{
            accountName:   PAYMENT_CONFIG.bankTransfer.accountName,
            accountNumber: PAYMENT_CONFIG.bankTransfer.accountNumber,
            bankName:      PAYMENT_CONFIG.bankTransfer.bankName,
            instructions:  PAYMENT_CONFIG.bankTransfer.instructions,
          }}
        />
      </div>
    </div>
  );
}
