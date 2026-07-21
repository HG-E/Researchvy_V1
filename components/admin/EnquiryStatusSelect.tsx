"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = ["pending", "contacted", "enrolled", "declined"] as const;
type Status = typeof STATUS_OPTIONS[number];

const STATUS_STYLES: Record<Status, { bg: string; text: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  contacted: { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  enrolled:  { bg: "rgba(16,185,129,0.12)",  text: "#34D399" },
  declined:  { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

interface Props {
  id: string;
  table: "clinic_enquiries" | "academy_enquiries";
  current: Status;
}

export function EnquiryStatusSelect({ id, table, current }: Props) {
  const [status,  setStatus]  = useState<Status>(current);
  const [loading, setLoading] = useState(false);

  async function handleChange(next: Status) {
    if (next === status) return;
    setLoading(true);
    try {
      await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, status: next }),
      });
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }

  const style = STATUS_STYLES[status];

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {loading && <Loader2 className="h-3 w-3 animate-spin" style={{ color: "#4B5563" }} />}
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={loading}
        className="appearance-none rounded-full px-2.5 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer disabled:opacity-60"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
