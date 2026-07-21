"use client";

import { useState } from "react";
import { CheckCircle, Clock, X } from "lucide-react";
import type { EventRegistrationStatus } from "@/types/event";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

interface Props {
  slug: string;
  isAuthenticated: boolean;
  currentStatus: EventRegistrationStatus | null;
  isFull: boolean;
  isPast: boolean;
}

export function RSVPButton({ slug, isAuthenticated, currentStatus, isFull, isPast }: Props) {
  const [status, setStatus]   = useState<EventRegistrationStatus | null>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const { track } = useAnalytics();

  async function handleRSVP() {
    if (!isAuthenticated) {
      window.location.href = `/signin?next=/events/${slug}`;
      return;
    }
    if (status === "registered" || status === "waitlisted") {
      // Cancel
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${slug}/register`, { method: "DELETE" });
        if (res.ok) {
          setStatus(null);
          track(EVENTS.EVENT_RSVP_CANCELLED, { slug });
        } else {
          const j = await res.json().catch(() => ({}));
          setError(j.error ?? "Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    // Register
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${slug}/register`, { method: "POST" });
      const j   = await res.json().catch(() => ({}));
      if (res.ok) {
        const newStatus = j.data?.status ?? "registered";
        setStatus(newStatus);
        track(EVENTS.EVENT_RSVP_COMPLETED, { slug, status: newStatus });
      } else {
        setError(j.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (isPast) return null;

  const isRegistered = status === "registered";
  const isWaitlisted = status === "waitlisted";

  return (
    <div className="space-y-2">
      <button
        onClick={handleRSVP}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all"
        style={{
          backgroundColor:
            isRegistered ? "#10B981" :
            isWaitlisted ? "#F59E0B" :
            isFull       ? "#4B5563" :
            "#2563EB",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : isRegistered ? (
          <><CheckCircle className="h-4 w-4" /> Registered — Cancel RSVP</>
        ) : isWaitlisted ? (
          <><Clock className="h-4 w-4" /> On Waitlist — Cancel</>
        ) : isFull ? (
          <><Clock className="h-4 w-4" /> Join Waitlist</>
        ) : (
          "RSVP — Reserve My Spot"
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}>
          <X className="h-3 w-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {isRegistered && (
        <p className="text-center text-[11px]" style={{ color: "#4B5563" }}>
          You&apos;ll receive a confirmation email. Check your dashboard for updates.
        </p>
      )}
    </div>
  );
}
