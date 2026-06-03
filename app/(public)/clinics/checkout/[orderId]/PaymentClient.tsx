"use client";

import { useState } from "react";
import { Copy, CheckCircle, Clock, Loader2, AlertCircle, Check } from "lucide-react";

type Order = {
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
  created_at:     string;
  user_name:      string;
  user_email:     string;
};

interface BankDetails {
  accountName:   string;
  accountNumber: string;
  bankName:      string;
  instructions:  string;
}

interface Props {
  order:           Order;
  bundleName:      string;
  formattedAmount: string;
  bankDetails:     BankDetails;
  isLoggedIn:      boolean;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 p-1 rounded transition-colors flex-shrink-0"
      style={{ color: copied ? "#10B981" : "#4B5563" }}
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b" style={{ borderColor: "#1E293B" }}>
      <span className="text-xs" style={{ color: "#6B7280" }}>{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-mono font-semibold" style={{ color: "#F9FAFB" }}>{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

export function PaymentClient({ order, bundleName, formattedAmount, bankDetails, isLoggedIn }: Props) {
  const [status, setStatus]   = useState(order.status);
  const [ref,    setRef]      = useState("");
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  async function confirmPayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/orders/${order.id}/submit`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submittedRef: ref.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("payment_submitted");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong — please try again");
    } finally {
      setLoading(false);
    }
  }

  if (status === "confirmed") {
    return (
      <div className="text-center py-12">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
        >
          <CheckCircle className="h-8 w-8" style={{ color: "#10B981" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          You're enrolled!
        </h1>
        <p className="text-sm mb-1" style={{ color: "#6B7280" }}>
          Order <span className="font-mono" style={{ color: "#9CA3AF" }}>{order.order_number}</span>
        </p>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          A confirmation has been sent to <span style={{ color: "#9CA3AF" }}>{order.user_email}</span>.
        </p>
      </div>
    );
  }

  if (status === "payment_submitted") {
    return (
      <div className="text-center py-12">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
        >
          <Clock className="h-8 w-8" style={{ color: "#F59E0B" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Payment received — verifying
        </h1>
        <p className="text-sm mb-1" style={{ color: "#6B7280" }}>
          Order <span className="font-mono" style={{ color: "#9CA3AF" }}>{order.order_number}</span>
        </p>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          Our team will confirm your enrollment within 2 business hours.
          We'll email <span style={{ color: "#9CA3AF" }}>{order.user_email}</span> when it's done.
        </p>
        <div
          className="rounded-xl px-5 py-4 text-xs border mb-3 text-left"
          style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Still waiting after 2 hours?</p>
              <p style={{ color: "#D97706" }}>
                Reply to the email we sent you, or contact us directly at{" "}
                <a href="mailto:researchvy@gmail.com" style={{ color: "#F59E0B", textDecoration: "underline" }}>
                  researchvy@gmail.com
                </a>{" "}
                with your order number <span className="font-mono font-bold">{order.order_number}</span> and we'll sort it out immediately.
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs" style={{ color: "#4B5563" }}>
          Reference: <span className="font-mono" style={{ color: "#6B7280" }}>{order.reference}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Payment Instructions
        </p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Complete Your Transfer
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Order <span className="font-mono" style={{ color: "#9CA3AF" }}>{order.order_number}</span>
          {" · "}{bundleName}
        </p>
      </div>

      {/* Amount highlight */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="h-1" style={{ background: "linear-gradient(90deg,#2563EB,#10B981)" }} />
        <div className="p-5">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
            Amount to Transfer
          </p>
          <p className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>{formattedAmount}</p>
          {order.is_early_bird && (
            <p className="text-xs mt-1" style={{ color: "#10B981" }}>Early bird price applied</p>
          )}
        </div>
      </div>

      {/* Bank details */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
          Bank Account Details
        </p>
        <BankRow label="Account Name"   value={bankDetails.accountName} />
        <BankRow label="Account Number" value={bankDetails.accountNumber} />
        <BankRow label="Bank"           value={bankDetails.bankName} />
        <div className="pt-2.5">
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Narration / Reference</p>
          <div
            className="flex items-center justify-between gap-2 rounded-xl px-4 py-3 border"
            style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.25)" }}
          >
            <span className="text-sm font-mono font-bold tracking-wide" style={{ color: "#60A5FA" }}>
              {order.reference}
            </span>
            <CopyButton value={order.reference} />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: "#374151" }}>
            Use this exactly as your payment narration so we can match your transfer.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
          How to Pay
        </p>
        <ol className="space-y-2">
          {[
            `Transfer exactly ${formattedAmount} to the account above`,
            `Use "${order.reference}" as your payment narration/description`,
            "Come back here and click \"I've Paid\" below",
            "Our team will verify and confirm your enrollment within 2 business hours",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs" style={{ color: "#6B7280" }}>
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ backgroundColor: "#1E293B", color: "#4B5563" }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Submit payment */}
      <form onSubmit={confirmPayment} className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4B5563" }}>
          Confirm Your Payment
        </p>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
            Bank transaction reference <span style={{ color: "#4B5563" }}>(optional but helpful)</span>
          </label>
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="e.g. TXN12345678"
            className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
            style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
          />
          <p className="text-[11px] mt-1" style={{ color: "#374151" }}>
            Your bank's transaction ID speeds up verification — you can skip this if you don't have it.
          </p>
        </div>

        {err && (
          <p
            className="text-sm rounded-xl px-4 py-3 border"
            style={{ color: "#F87171", backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
          >
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#10B981" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              I've Paid — Notify the Team
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs" style={{ color: "#374151" }}>
        Questions? Email us at researchvy@gmail.com · We confirm within 2 business hours.
      </p>
    </div>
  );
}
