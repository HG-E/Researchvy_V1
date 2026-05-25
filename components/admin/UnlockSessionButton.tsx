"use client";

import { useState } from "react";
import { Unlock, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  clinicSlug:    string;
  cohortId:      string;
  sessionNumber: number;
  isUnlocked:    boolean;
}

export function UnlockSessionButton({ clinicSlug, cohortId, sessionNumber, isUnlocked }: Props) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  if (unlocked) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
        style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Unlocked
      </span>
    );
  }

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clinic-tasks/unlock", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ clinic_slug: clinicSlug, cohort_id: cohortId, session_number: sessionNumber }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error ?? "Failed to unlock");
      } else {
        setUnlocked(true);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUnlock}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: "#2563EB" }}
      >
        {loading
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <Unlock className="h-3.5 w-3.5" />
        }
        Unlock for cohort
      </button>
      {error && <span className="text-xs" style={{ color: "#F87171" }}>{error}</span>}
    </div>
  );
}
