"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function WaitlistNotifyToggle({ id, initial }: { id: string; initial: boolean }) {
  const [notified, setNotified] = useState(initial);
  const [loading,  setLoading]  = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ notified: !notified }),
      });
      if (res.ok) setNotified(!notified);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity disabled:opacity-60"
      style={{
        backgroundColor: notified ? "rgba(16,185,129,0.12)" : "rgba(37,99,235,0.10)",
        color:           notified ? "#10B981"                : "#60A5FA",
      }}
    >
      {loading
        ? <Loader2 className="h-3 w-3 animate-spin" />
        : <CheckCircle className="h-3 w-3" />}
      {notified ? "Notified" : "Mark notified"}
    </button>
  );
}
