"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "publish" | "feature" | "reject" | "archive" | "cancel" | "unfeature";

interface Props {
  eventId: string;
  currentStatus: string;
  isFeatured: boolean;
}

export function EventStatusToggle({ eventId, currentStatus, isFeatured }: Props) {
  const router          = useRouter();
  const [loading, setLoading]   = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [error, setError]           = useState<string | null>(null);

  async function act(action: Action, note?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error ?? "Action failed."); return; }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isPending  = currentStatus === "pending";
  const isLive     = currentStatus === "published" || currentStatus === "featured";
  const isRejected = currentStatus === "rejected";

  return (
    <div className="flex flex-col gap-1.5 items-end">
      {/* Publish / feature */}
      {(isPending || isRejected) && (
        <button
          onClick={() => act("publish")}
          disabled={loading}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
        >
          Publish
        </button>
      )}

      {isLive && !isFeatured && (
        <button
          onClick={() => act("feature")}
          disabled={loading}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#A78BFA" }}
        >
          ★ Feature
        </button>
      )}

      {isFeatured && (
        <button
          onClick={() => act("unfeature")}
          disabled={loading}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "rgba(100,116,139,0.1)", color: "#4B5563" }}
        >
          Unfeature
        </button>
      )}

      {/* Reject */}
      {(isPending || isLive) && !showReject && (
        <button
          onClick={() => setShowReject(true)}
          disabled={loading}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}
        >
          Reject
        </button>
      )}

      {showReject && (
        <div className="w-64 rounded-xl border p-3 space-y-2" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
          <textarea
            className="w-full text-xs rounded-lg p-2 resize-none"
            style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#D1D5DB", minHeight: "60px" }}
            placeholder="Rejection note to submitter (optional)"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          <div className="flex gap-1.5">
            <button
              onClick={() => { act("reject", rejectNote); setShowReject(false); }}
              disabled={loading}
              className="flex-1 text-[11px] font-bold py-1.5 rounded-lg"
              style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#F87171" }}
            >
              Confirm Reject
            </button>
            <button
              onClick={() => setShowReject(false)}
              className="text-[11px] py-1.5 px-2 rounded-lg"
              style={{ color: "#4B5563" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Archive */}
      {isLive && (
        <button
          onClick={() => act("archive")}
          disabled={loading}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "transparent", color: "#4B5563" }}
        >
          Archive
        </button>
      )}

      {error && <p className="text-[10px]" style={{ color: "#F87171" }}>{error}</p>}
    </div>
  );
}
