"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Props {
  slug: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}

export function SaveEventButton({ slug, initialSaved, isAuthenticated }: Props) {
  const [saved, setSaved]       = useState(initialSaved);
  const [loading, setLoading]   = useState(false);

  async function toggle() {
    if (!isAuthenticated) {
      window.location.href = `/signin?next=/events/${slug}`;
      return;
    }
    setLoading(true);
    try {
      const method = saved ? "DELETE" : "POST";
      const res    = await fetch(`/api/events/${slug}/save`, { method });
      if (res.ok) setSaved(!saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from saved" : "Save event"}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
      style={{
        backgroundColor: saved ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
        color:           saved ? "#A78BFA" : "#6B7280",
        border:          `1px solid ${saved ? "rgba(139,92,246,0.3)" : "#1E293B"}`,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
