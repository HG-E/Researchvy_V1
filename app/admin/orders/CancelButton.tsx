"use client";

import { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";

export function CancelButton({ orderId }: { orderId: string }) {
  const [open,    setOpen]    = useState(false);
  const [reason,  setReason]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  async function submit() {
    if (loading) return;
    setLoading(true);
    setErr(null);
    try {
      const res  = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDone(true);
      setOpen(false);
      // No router.refresh() — state update is instant; refresh added 200-500ms freeze
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#F87171" }}>
        <XCircle className="h-3.5 w-3.5" /> Cancelled
      </span>
    );
  }

  if (open) {
    return (
      <div className="flex flex-col items-end gap-2 min-w-[200px]">
        <input
          autoFocus
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="w-full rounded-lg px-3 py-2.5 text-xs border outline-none min-h-[44px]"
          style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-xs min-h-[44px]"
            style={{ color: "#6B7280" }}
          >
            Back
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-xs font-semibold disabled:opacity-60 min-h-[44px]"
            style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#F87171" }}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
            Confirm cancel
          </button>
        </div>
        {err && <p className="text-[10px]" style={{ color: "#F87171" }}>{err}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition-opacity min-h-[44px]"
      style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}
      title="Cancel order"
    >
      <XCircle className="h-3 w-3" />
      Cancel
    </button>
  );
}
