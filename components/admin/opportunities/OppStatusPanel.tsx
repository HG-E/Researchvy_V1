"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle, ChevronDown, Eye, EyeOff, Star } from "lucide-react";

interface Props {
  oppId: string;
  isPublished: boolean;
  isFeatured: boolean;
  submissionStatus: string;
}

export function OppStatusPanel({ oppId, isPublished, isFeatured, submissionStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [error, setError] = useState("");

  async function act(action: string, note?: string) {
    setLoading(action);
    setError("");
    try {
      const res = await fetch(`/api/admin/opportunities/${oppId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(note ? { note } : {}) }),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        setError(json.error ?? "Action failed");
      } else {
        router.refresh();
        setRejectOpen(false);
        setRejectNote("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  }

  async function unpublish() {
    setLoading("unpublish");
    setError("");
    try {
      await fetch(`/api/admin/opportunities/${oppId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: false }),
      });
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  }

  const isPending  = submissionStatus === "pending";
  const isRejected = submissionStatus === "rejected";

  return (
    <div className="space-y-2">
      {/* Publish / Unpublish */}
      {(!isPublished || isPending || isRejected) ? (
        <button
          onClick={() => act("publish")}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}
        >
          {loading === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Publish
        </button>
      ) : (
        <button
          onClick={unpublish}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "rgba(107,114,128,0.1)", color: "#9CA3AF" }}
        >
          {loading === "unpublish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
          Unpublish
        </button>
      )}

      {/* Feature / Unfeature */}
      {isPublished && !isFeatured && (
        <button
          onClick={() => act("feature")}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#A78BFA" }}
        >
          {loading === "feature" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
          Feature
        </button>
      )}
      {isFeatured && (
        <button
          onClick={() => act("unfeature")}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "rgba(107,114,128,0.1)", color: "#6B7280" }}
        >
          {loading === "unfeature" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
          Unfeature
        </button>
      )}

      {/* Reject */}
      {!isRejected && (
        rejectOpen ? (
          <div className="flex flex-col gap-1.5">
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Optional note to submitter…"
              className="w-full text-xs rounded-xl px-3 py-2 outline-none resize-none"
              style={{
                backgroundColor: "#0A0F1A",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#F9FAFB",
                minHeight: "64px",
              }}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => { setRejectOpen(false); setRejectNote(""); }}
                className="flex-1 rounded-xl px-3 py-2 text-xs font-medium"
                style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
              >
                Cancel
              </button>
              <button
                onClick={() => act("reject", rejectNote.trim() || undefined)}
                disabled={!!loading}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-60"
                style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#F87171" }}
              >
                {loading === "reject" && <Loader2 className="h-3 w-3 animate-spin" />}
                Confirm Reject
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRejectOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}
          >
            <XCircle className="h-4 w-4" />
            Reject
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
        )
      )}

      {error && (
        <p className="text-xs text-center mt-1" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}
