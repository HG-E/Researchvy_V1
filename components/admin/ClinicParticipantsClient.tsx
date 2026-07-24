"use client";

import { useState } from "react";
import { AddClinicParticipantForm } from "./AddClinicParticipantForm";
import { ClinicParticipantsTable, type ParticipantRow } from "./ClinicParticipantsTable";

export function ClinicParticipantsClient({ initial }: { initial: ParticipantRow[] }) {
  const [rows, setRows] = useState(initial);

  const pending = rows.filter((r) => r.status === "pending").length;
  const active  = rows.filter((r) => r.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",   value: rows.length, color: "#60A5FA" },
          { label: "Pending", value: pending,      color: "#FCD34D" },
          { label: "Active",  value: active,       color: "#34D399" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border px-5 py-4"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs mb-1" style={{ color: "#6B7280" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      <AddClinicParticipantForm
        onAdded={(row) => setRows((prev) => [{ ...row, cert_number: null }, ...prev])}
      />

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <ClinicParticipantsTable rows={rows} />
      </div>
    </div>
  );
}
