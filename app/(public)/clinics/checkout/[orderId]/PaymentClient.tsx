"use client";

import { useState } from "react";
import { Copy, CheckCircle, Clock, Loader2, AlertCircle, Check, ArrowRight, BookOpen, Users, Calendar } from "lucide-react";

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

export function PaymentClient({ order, bundleName, formattedAmount, bankDetails }: Props) {
  const [status,    setStatus]    = useState(order.status);
  const [ref,       setRef]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err,       setErr]       = useState<string | null>(null);

  async function confirmPayment(e: React.FormEvent) {
    e.preventDefault();
    if (loading || submitted) return;
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
      setSubmitted(true);
      setStatus("payment_submitted");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong — please try again");
    } finally {
      setLoading(false);
    }
  }

  if (status === "confirmed") {
    const NEXT_STEPS = [
      {
        icon:  Calendar,
        color: "#2563EB",
        label: "Check your email",
        detail: "Your enrolment confirmation and session dates are on their way to " + order.user_email + ".",
      },
      {
        icon:  Users,
        color: "#7C3AED",
        label: "Meet your cohort",
        detail: "In the next few days you'll receive an introduction to your fellow researchers.",
      },
      {
        icon:  BookOpen,
        color: "#10B981",
        label: "Start Academy Level 1 (free)",
        detail: "Build your foundation knowledge before Session 1. Takes about 2 hours.",
      },
    ];
    return (
      <div className="space-y-6">
        {/* Confirmation header */}
        <div className="text-center py-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
          >
            <CheckCircle className="h-8 w-8" style={{ color: "#10B981" }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            You&apos;re enrolled!
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Order <span className="font-mono" style={{ color: "#9CA3AF" }}>{order.order_number}</span>
            {" · "}Confirmation sent to <span style={{ color: "#9CA3AF" }}>{order.user_email}</span>
          </p>
        </div>

        {/* What happens next */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
            What happens next
          </p>
          <div className="space-y-4">
            {NEXT_STEPS.map(({ icon: Icon, color, label, detail }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: color + "15" }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#F9FAFB" }}>{label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard/clinics"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#2563EB" }}
          >
            Go to My Clinics Dashboard
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/academy/courses"
            className="flex items-center justify-center gap-2 w-full rounded-xl border px-6 py-3.5 text-sm font-bold transition-all hover:border-[#334155]"
            style={{ borderColor: "#1E293B", color: "#F9FAFB" }}
          >
            Start Academy Level 1 (Free)
          </a>
        </div>
      </div>
    );
  }

  if (status === "payment_submitted") {
    const waFallback = `https://wa.me/2347030515183?text=${encodeURIComponent(
      `Hi, I submitted my payment notification for order ${order.order_number} (ref: ${order.reference}) and I'm following up on verification. My name is ${order.user_name}.`
    )}`;
    return (
      <div className="space-y-5">
        <div className="text-center py-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
          >
            <Clock className="h-8 w-8" style={{ color: "#F59E0B" }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Payment received — verifying
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Order <span className="font-mono" style={{ color: "#9CA3AF" }}>{order.order_number}</span>
            {" · "}We&apos;ll email <span style={{ color: "#9CA3AF" }}>{order.user_email}</span> within 2 business hours.
          </p>
        </div>

        {/* What happens next */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
            What happens next
          </p>
          <ol className="space-y-3">
            {[
              "Our team verifies your transfer against the reference code — usually within 2 business hours.",
              `You'll receive a confirmation email at ${order.user_email} with your cohort details.`,
              "You'll be added to the cohort WhatsApp group and given session access.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ backgroundColor: "#1E293B", color: "#4B5563" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Fallback if waiting too long */}
        <div
          className="rounded-xl border px-5 py-4"
          style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}
        >
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
            <p className="text-xs font-semibold" style={{ color: "#D97706" }}>Still waiting after 2 hours?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={waFallback}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <span>WhatsApp us directly</span>
            </a>
            <a
              href={`mailto:researchvy@gmail.com?subject=Payment+Verification+${order.order_number}&body=Hi%2C+I+submitted+payment+for+order+${order.order_number}+(ref%3A+${order.reference})+and+I%27m+following+up+on+verification.`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
              style={{ borderColor: "#334155", color: "#9CA3AF" }}
            >
              Email the team
            </a>
          </div>
          <p className="text-[11px] mt-2" style={{ color: "#4B5563" }}>
            Reference: <span className="font-mono">{order.reference}</span>
          </p>
        </div>
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
          <p className="text-[11px] mt-1.5" style={{ color: "#6B7280" }}>
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
          <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>
            Your bank&apos;s transaction ID speeds up verification — you can skip this if you don&apos;t have it.
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
              I&apos;ve Paid — Notify the Team
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs" style={{ color: "#6B7280" }}>
        Questions? Email us at researchvy@gmail.com · We confirm within 2 business hours.
      </p>
    </div>
  );
}
