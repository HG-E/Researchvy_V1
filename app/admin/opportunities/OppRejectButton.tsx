"use client";

import { useState } from "react";
import { Loader2, XCircle, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  oppId: string;
}

export function OppRejectButton({ oppId }: Props) {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);

  async function reject() {
    setLoading(true);
    await fetch(`/api/admin/opportunities/${oppId}/review`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: "reject", note: note.trim() || undefined }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold min-h-[36px]"
        style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}
      >
        <XCircle className="h-3 w-3" />
        Reject
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 items-end">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note to submitter…"
        className="w-52 text-xs rounded-lg px-3 py-2 outline-none resize-none"
        style={{ backgroundColor: "#0A0F1A", border: "1px solid rgba(239,68,68,0.3)", color: "#F9FAFB", minHeight: "56px" }}
        autoFocus
      />
      <div className="flex gap-1.5">
        <button
          onClick={() => { setOpen(false); setNote(""); }}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium"
          style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
        >
          Cancel
        </button>
        <button
          onClick={reject}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
          style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#F87171" }}
        >
          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
          Confirm Reject
        </button>
      </div>
    </div>
  );
}
