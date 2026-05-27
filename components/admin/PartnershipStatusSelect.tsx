"use client";

import { useState, useTransition } from "react";

const OPTIONS = [
  { value: "new",         label: "New",         bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  { value: "contacted",   label: "Contacted",   bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  { value: "in_progress", label: "In Progress", bg: "rgba(139,92,246,0.12)",  text: "#A78BFA" },
  { value: "closed",      label: "Closed",      bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
];

export function PartnershipStatusSelect({ id, initial }: { id: string; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [pending, startTransition] = useTransition();

  const current = OPTIONS.find(o => o.value === status) ?? OPTIONS[0];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    startTransition(async () => {
      await fetch(`/api/admin/partnerships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    });
  }

  return (
    <div className="relative inline-flex items-center">
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ backgroundColor: current.bg }}
        aria-hidden
      />
      <select
        value={status}
        onChange={handleChange}
        disabled={pending}
        className="relative appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer bg-transparent"
        style={{ color: current.text, opacity: pending ? 0.6 : 1 }}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-1.5 h-3 w-3" viewBox="0 0 20 20" fill="currentColor"
        style={{ color: current.text }}>
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  );
}
