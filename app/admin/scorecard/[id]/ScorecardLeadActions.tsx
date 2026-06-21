"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

const STATUSES = [
  { value: "new",       label: "New",       color: "#2563EB" },
  { value: "contacted", label: "Contacted", color: "#F59E0B" },
  { value: "booked",    label: "Booked",    color: "#8B5CF6" },
  { value: "enrolled",  label: "Enrolled",  color: "#10B981" },
  { value: "lost",      label: "Lost",      color: "#4B5563" },
];

interface Props {
  leadId:         string;
  currentStatus:  string;
  currentNotes:   string;
}

export function ScorecardLeadActions({ leadId, currentStatus, currentNotes }: Props) {
  const router           = useRouter();
  const [status, setStatus]   = useState(currentStatus);
  const [notes, setNotes]     = useState(currentNotes);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/scorecard/${leadId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status, admin_notes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const changed = status !== currentStatus || notes !== currentNotes;

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4B5563" }}>
        Lead status
      </p>

      {/* Status buttons */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: status === s.value ? s.color + "30" : "transparent",
              color:           status === s.value ? s.color : "#4B5563",
              border:          `1px solid ${status === s.value ? s.color + "50" : "#1E293B"}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "#6B7280" }}>Admin notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Add follow-up notes, consultation summary, objections…"
          className="w-full rounded-xl px-3 py-2.5 text-xs resize-none outline-none focus:ring-1"
          style={{
            backgroundColor: "#080E1A",
            borderColor:     "#1E293B",
            color:           "#D1D5DB",
            border:          "1px solid #1E293B",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !changed}
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
        style={{
          backgroundColor: saved ? "#10B981" : "#2563EB",
          color: "#fff",
        }}
      >
        {saving ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
        ) : saved ? (
          <><Check className="h-3.5 w-3.5" /> Saved</>
        ) : (
          "Save changes"
        )}
      </button>
    </div>
  );
}
