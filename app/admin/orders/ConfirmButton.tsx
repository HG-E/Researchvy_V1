"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function ConfirmButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  async function confirm() {
    if (loading || done) return;
    setLoading(true);
    setErr(null);
    try {
      const res  = await fetch(`/api/admin/orders/${orderId}/confirm`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDone(true);
      // No router.refresh() — state update is instant; full page refresh was adding 200-500ms freeze
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#10B981" }}>
        <CheckCircle className="h-3.5 w-3.5" /> Confirmed
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={confirm}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-opacity disabled:opacity-60 min-h-[44px]"
        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
        Confirm
      </button>
      {err && <p className="text-[10px]" style={{ color: "#F87171" }}>{err}</p>}
    </div>
  );
}
