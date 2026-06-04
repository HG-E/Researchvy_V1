import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { ConfirmButton } from "./ConfirmButton";
import { CancelButton }  from "./CancelButton";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Orders" });

type OrderRow = {
  id:             string;
  order_number:   string;
  reference:      string;
  bundle_id:      string;
  module_id:      string | null;
  currency:       "ngn" | "usd";
  amount:         number;
  is_early_bird:  boolean;
  status:         "pending_payment" | "payment_submitted" | "confirmed" | "cancelled";
  payment_method: string;
  submitted_ref:  string | null;
  user_name:      string;
  user_email:     string;
  user_phone:     string | null;
  created_at:     string;
  confirmed_at:   string | null;
};

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  pending_payment:    { label: "Pending",    bg: "rgba(245,158,11,0.1)",  color: "#F59E0B" },
  payment_submitted:  { label: "Submitted",  bg: "rgba(99,102,241,0.1)",  color: "#818CF8" },
  confirmed:          { label: "Confirmed",  bg: "rgba(16,185,129,0.1)",  color: "#10B981" },
  cancelled:          { label: "Cancelled",  bg: "rgba(239,68,68,0.08)",  color: "#F87171" },
};

function bundleLabel(bundleId: string, moduleId: string | null): string {
  if (bundleId === "solo" && moduleId) {
    const s = digitalVisibilityClinic.sessions.find((x) => x.id === moduleId);
    return s ? `${s.name} (Solo)` : "Solo";
  }
  return digitalVisibilityClinic.pricing.bundles.find((b) => b.id === bundleId)?.name ?? bundleId;
}

export default async function AdminOrdersPage() {
  const admin = createSupabaseAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select(
      "id,order_number,reference,bundle_id,module_id,currency,amount,is_early_bird,status,payment_method,submitted_ref,user_name,user_email,user_phone,created_at,confirmed_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (orders ?? []) as OrderRow[];

  const counts = {
    pending:   rows.filter((r) => r.status === "pending_payment").length,
    submitted: rows.filter((r) => r.status === "payment_submitted").length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Orders
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Orders
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {rows.length} total · {counts.submitted} awaiting confirmation
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Pending payment", count: counts.pending,   color: "#F59E0B" },
          { label: "Submitted",       count: counts.submitted, color: "#818CF8" },
          { label: "Confirmed",       count: counts.confirmed, color: "#10B981" },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="rounded-xl border px-4 py-3 min-w-[120px]"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-2xl font-bold" style={{ color }}>{count}</p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{label}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-sm" style={{ color: "#4B5563" }}>No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "#1E293B", color: "#4B5563" }}>
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Bundle</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Reference</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#1E293B" }}>
                {rows.map((order) => {
                  const st  = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending_payment;
                  const amt = order.currency === "ngn"
                    ? `₦${order.amount.toLocaleString("en-NG")}`
                    : `$${order.amount}`;

                  return (
                    <tr
                      key={order.id}
                      className="border-b"
                      style={{
                        borderColor: "#1E293B",
                        backgroundColor: order.status === "payment_submitted" ? "rgba(99,102,241,0.03)" : "transparent",
                      }}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-mono text-xs font-semibold" style={{ color: "#F9FAFB" }}>{order.order_number}</p>
                        {order.is_early_bird && (
                          <span className="text-[10px] font-bold" style={{ color: "#F59E0B" }}>Early bird</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold" style={{ color: "#F9FAFB" }}>{order.user_name}</p>
                        <p className="text-[11px]" style={{ color: "#6B7280" }}>{order.user_email}</p>
                        {order.user_phone && (
                          <p className="text-[11px]" style={{ color: "#4B5563" }}>{order.user_phone}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{bundleLabel(order.bundle_id, order.module_id)}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-xs font-semibold" style={{ color: "#F9FAFB" }}>{amt}</p>
                        <p className="text-[11px] uppercase" style={{ color: "#4B5563" }}>{order.currency}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs" style={{ color: "#60A5FA" }}>{order.reference}</p>
                        {order.submitted_ref && (
                          <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
                            Txn: {order.submitted_ref}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{ backgroundColor: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: "#4B5563" }}>
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {(order.status === "pending_payment" || order.status === "payment_submitted") && (
                          <div className="flex flex-col items-end gap-1.5">
                            <ConfirmButton orderId={order.id} />
                            <CancelButton  orderId={order.id} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
