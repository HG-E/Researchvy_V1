"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Gift } from "lucide-react";

type ReferralData = {
  code:          string;
  uses:          number;
  earnings_ngn:  number;
  earnings_usd:  number;
};

export function ReferralWidget() {
  const [data,   setData]   = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function copy() {
    if (!data) return;
    const link = `${window.location.origin}/clinics?ref=${data.code}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || !data) return null;

  const hasEarnings = data.earnings_ngn > 0 || data.earnings_usd > 0;

  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-4 w-4" style={{ color: "#F59E0B" }} />
        <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Refer a Researcher</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
          Earn 5%
        </span>
      </div>

      <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>
        Share your link. When someone enrolls in the DVC using your code, you earn{" "}
        <strong style={{ color: "#D1D5DB" }}>5% commission</strong> on their payment.
      </p>

      {/* Copy link */}
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5 mb-4" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
        <code className="flex-1 text-xs font-mono truncate" style={{ color: "#60A5FA" }}>
          researchvy.com/clinics?ref={data.code}
        </code>
        <button
          onClick={copy}
          className="flex-shrink-0 p-1 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          style={{ color: copied ? "#10B981" : "#4B5563" }}
          title="Copy referral link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0A0F1A" }}>
          <p className="text-lg font-bold" style={{ color: "#F9FAFB" }}>{data.uses}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>uses</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0A0F1A" }}>
          <p className="text-lg font-bold" style={{ color: hasEarnings ? "#10B981" : "#374151" }}>
            {data.earnings_ngn > 0 ? `₦${data.earnings_ngn.toLocaleString("en-NG")}` : "₦0"}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>NGN earned</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0A0F1A" }}>
          <p className="text-lg font-bold" style={{ color: hasEarnings ? "#10B981" : "#374151" }}>
            {data.earnings_usd > 0 ? `$${data.earnings_usd}` : "$0"}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>USD earned</p>
        </div>
      </div>

      {hasEarnings && (
        <p className="text-xs mt-3" style={{ color: "#6B7280" }}>
          Commissions are paid out monthly. Reply to any Researchvy email to request your payout.
        </p>
      )}
    </div>
  );
}
