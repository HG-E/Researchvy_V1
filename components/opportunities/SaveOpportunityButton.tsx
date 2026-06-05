"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

interface Props {
  opportunityId: string;
  initialSaved:  boolean;
}

export function SaveOpportunityButton({ opportunityId, initialSaved }: Props) {
  const [saved,   setSaved]   = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: saved ? "DELETE" : "POST",
      });
      if (res.ok) setSaved(!saved);
      else if (res.status === 401) {
        window.location.href = `/signin?next=/opportunities/${opportunityId}`;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved opportunities" : "Save opportunity for deadline reminders"}
      title={saved ? "Remove from saved" : "Save — get deadline reminders"}
      className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-60"
      style={{
        backgroundColor: saved ? "rgba(37,99,235,0.1)"  : "transparent",
        borderColor:     saved ? "rgba(37,99,235,0.4)"  : "#334155",
        color:           saved ? "#60A5FA"               : "#9CA3AF",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor     = saved ? "rgba(37,99,235,0.6)" : "#4B5563";
          e.currentTarget.style.color           = saved ? "#93C5FD"             : "#F9FAFB";
          e.currentTarget.style.backgroundColor = saved ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.03)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor     = saved ? "rgba(37,99,235,0.4)" : "#334155";
        e.currentTarget.style.color           = saved ? "#60A5FA"             : "#9CA3AF";
        e.currentTarget.style.backgroundColor = saved ? "rgba(37,99,235,0.1)" : "transparent";
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
