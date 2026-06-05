"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Zap, Building2, CreditCard, Loader2 } from "lucide-react";

type Bundle = {
  id:           string;
  name:         string;
  tagline:      string;
  isSolo:       boolean;
  savingsLabel: string;
  usd:          { regular: number; earlyBird: number };
  ngn:          { regular: number; earlyBird: number };
  includes:     string[];
};

type Module = {
  id:        string;
  name:      string;
  title:     string;
  soloPrice: { usd: { regular: number; earlyBird: number }; ngn: { regular: number; earlyBird: number } };
};

interface Props {
  userId:            string;
  userEmail:         string;
  userName:          string;
  bundle:            Bundle;
  modules:           Module[];
  initialModuleId:   string | null;
  isEarlyBird:       boolean;
  earlyBirdDeadline: string;
  initialRefCode?:   string | null;
}

function fmt(amount: number, currency: "ngn" | "usd") {
  return currency === "ngn" ? `₦${amount.toLocaleString("en-NG")}` : `$${amount}`;
}

export function CheckoutForm({
  userId,
  userEmail,
  userName,
  bundle,
  modules,
  initialModuleId,
  isEarlyBird,
  earlyBirdDeadline,
  initialRefCode,
}: Props) {
  const router   = useRouter();
  const [currency, setCurrency]   = useState<"ngn" | "usd">("ngn");
  const [moduleId, setModuleId]   = useState(initialModuleId ?? modules[0]?.id ?? "");
  const [name,    setName]        = useState(userName);
  const [phone,   setPhone]       = useState("");
  const [refCode, setRefCode]     = useState(initialRefCode ?? "");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err,     setErr]         = useState<string | null>(null);

  const selModule = bundle.isSolo ? modules.find((m) => m.id === moduleId) : null;

  const { amount, regular } = useMemo(() => {
    if (bundle.isSolo && selModule) {
      const p = selModule.soloPrice;
      return currency === "usd"
        ? { amount: isEarlyBird ? p.usd.earlyBird : p.usd.regular, regular: p.usd.regular }
        : { amount: isEarlyBird ? p.ngn.earlyBird : p.ngn.regular, regular: p.ngn.regular };
    }
    return currency === "usd"
      ? { amount: isEarlyBird ? bundle.usd.earlyBird : bundle.usd.regular, regular: bundle.usd.regular }
      : { amount: isEarlyBird ? bundle.ngn.earlyBird : bundle.ngn.regular, regular: bundle.ngn.regular };
  }, [bundle, selModule, currency, isEarlyBird]);
  const savings = regular - amount;
  const ebDate  = new Date(earlyBirdDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || submitted) return;
    if (!name.trim())                  { setErr("Please enter your full name"); return; }
    if (bundle.isSolo && !moduleId)    { setErr("Please select a module"); return; }

    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug: "digital-visibility-clinic",
          bundleId:   bundle.id,
          moduleId:   bundle.isSolo ? moduleId : null,
          currency,
          userEmail,
          userName:  name.trim(),
          userPhone:    phone.trim()   || null,
          referralCode: refCode.trim() || null,
          userId,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.orderId) {
        router.replace(`/clinics/checkout/${data.orderId}`);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to create order");
      setSubmitted(true);
      router.replace(`/clinics/checkout/${data.orderId}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong — please try again");
      setLoading(false);
    } finally {
      // Ensure loading resets if navigation fails or component stays mounted
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/clinics"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: "#4B5563" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Clinics
        </Link>

        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Secure Checkout
        </p>
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Complete Your Enrollment
        </h1>

        <form onSubmit={submit} className="space-y-5">

          {/* Order summary */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-1" style={{ background: "linear-gradient(90deg,#2563EB,#10B981)" }} />
            <div className="p-6">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
                Your Order
              </p>

              {/* Bundle name + tagline */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{bundle.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{bundle.tagline}</p>
                </div>
                {isEarlyBird && savings > 0 && (
                  <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
                    <Zap className="h-2.5 w-2.5" />
                    Early bird
                  </span>
                )}
              </div>

              {/* Solo module selector */}
              {bundle.isSolo && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>
                    Which module?
                  </label>
                  <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
                    style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Currency toggle */}
              <div className="flex gap-2 mb-4">
                {(["ngn", "usd"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className="flex-1 rounded-lg py-2 text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: currency === c ? "#2563EB" : "#1E293B",
                      color:           currency === c ? "#fff"    : "#6B7280",
                    }}
                  >
                    {c === "ngn" ? "NGN (₦)" : "USD ($)"}
                  </button>
                ))}
              </div>

              {/* Price display */}
              <div className="rounded-xl p-4" style={{ backgroundColor: "#1E293B" }}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>
                    {bundle.isSolo && !selModule && "from "}{fmt(amount, currency)}
                  </span>
                  {savings > 0 && (
                    <span className="text-xs line-through" style={{ color: "#374151" }}>
                      {fmt(regular, currency)}
                    </span>
                  )}
                </div>
                {isEarlyBird && savings > 0 && (
                  <p className="text-xs mt-1" style={{ color: "#10B981" }}>
                    Early bird saves {fmt(savings, currency)} · ends {ebDate}
                  </p>
                )}
              </div>

              {/* What's included */}
              <ul className="mt-4 space-y-1.5">
                {bundle.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6B7280" }}>
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Your details */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              Your Details
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>Full name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Your Full Name"
                  required
                  className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>Email</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full rounded-xl px-4 py-2.5 text-sm border"
                  style={{ backgroundColor: "#0A1120", borderColor: "#1E293B", color: "#4B5563" }}
                />
                <p className="text-[11px] mt-1" style={{ color: "#374151" }}>
                  From your account · receipt will be sent here
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
                  WhatsApp / phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
                  Referral code <span style={{ color: "#4B5563" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TUNDE123"
                  className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
                />
                <p className="text-[11px] mt-1" style={{ color: "#374151" }}>
                  If a colleague referred you, enter their code here
                </p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              Payment Method
            </p>

            {/* Bank transfer — active */}
            <div
              className="flex items-start gap-3 rounded-xl border p-4 mb-3"
              style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.3)" }}
            >
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0" style={{ borderColor: "#2563EB" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Building2 className="h-4 w-4" style={{ color: "#60A5FA" }} />
                  <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Bank Transfer</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#34D399" }}>
                    Recommended
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Transfer directly to our account. Your order reference is used as the narration.
                  Confirmed within 2 business hours.
                </p>
              </div>
            </div>

            {/* OPay — placeholder */}
            <div
              className="flex items-start gap-3 rounded-xl border p-4 opacity-45"
              style={{ backgroundColor: "#0A1120", borderColor: "#1E293B" }}
            >
              <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" style={{ borderColor: "#374151" }} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CreditCard className="h-4 w-4" style={{ color: "#4B5563" }} />
                  <p className="text-sm font-semibold" style={{ color: "#6B7280" }}>OPay</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1E293B", color: "#4B5563" }}>
                    Coming soon
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#4B5563" }}>Pay via OPay app</p>
              </div>
            </div>
          </div>

          {/* Error */}
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
            disabled={loading || submitted}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: "#2563EB" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating your order…
              </>
            ) : (
              <>
                Get Payment Instructions
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs" style={{ color: "#374151" }}>
            Enrollment is confirmed only after payment is verified by our team.
          </p>
        </form>
      </div>
    </div>
  );
}
