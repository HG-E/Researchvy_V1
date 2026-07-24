"use client";

import { useState } from "react";
import { ClinicParticipantActions, type ParticipantStatus } from "./ClinicParticipantActions";
import { IssueCertButton } from "./IssueCertButton";

export interface ParticipantRow {
  id:                 string;
  email:              string;
  full_name:          string;
  phone:              string | null;
  bundle:             string;
  track:              string | null;
  mode:               string;
  status:             ParticipantStatus;
  payment_ref:        string | null;
  whatsapp_group_url: string | null;
  created_at:         string;
  approved_at:        string | null;
  approved_by:        string | null;
  notes:              string | null;
  cert_number:        string | null;
}

const BUNDLE_COLORS: Record<string, string> = {
  solo: "#10B981",
  core: "#2563EB",
  pro:  "#8B5CF6",
};

const STATUS_STYLES: Record<ParticipantStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: "rgba(245,158,11,0.12)", color: "#FCD34D", label: "Pending" },
  active:  { bg: "rgba(16,185,129,0.12)", color: "#34D399", label: "Active" },
  revoked: { bg: "rgba(239,68,68,0.1)",   color: "#F87171", label: "Revoked" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ClinicParticipantsTable({ rows: initial }: { rows: ParticipantRow[] }) {
  const [rows, setRows] = useState(initial);

  function handleStatusChange(id: string, status: ParticipantStatus) {
    setRows((prev) =>
      prev.map((r) => r.id === id ? { ...r, status } : r)
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-center py-12" style={{ color: "#4B5563" }}>
        No participants yet. Use the form above to add one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid #1E293B" }}>
            {["Participant", "Bundle / Track", "Mode", "Status", "Added", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold tracking-wide text-[10px] uppercase"
                style={{ color: "#4B5563" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const statusStyle = STATUS_STYLES[p.status];
            const bundleColor = BUNDLE_COLORS[p.bundle] ?? "#9CA3AF";
            return (
              <tr
                key={p.id}
                className="border-b transition-colors hover:bg-white/[0.01]"
                style={{ borderColor: "#1E293B" }}
              >
                {/* Name + email */}
                <td className="px-4 py-4">
                  <p className="font-semibold mb-0.5" style={{ color: "#F9FAFB" }}>{p.full_name}</p>
                  <p style={{ color: "#6B7280" }}>{p.email}</p>
                  {p.phone && <p style={{ color: "#6B7280" }}>{p.phone}</p>}
                  {p.payment_ref && (
                    <p className="mt-0.5" style={{ color: "#4B5563" }}>Ref: {p.payment_ref}</p>
                  )}
                </td>

                {/* Bundle / track */}
                <td className="px-4 py-4">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1"
                    style={{ backgroundColor: bundleColor + "18", color: bundleColor, fontSize: 9 }}
                  >
                    {p.bundle}
                  </span>
                  {p.track && (
                    <p style={{ color: "#6B7280" }}>{p.track}</p>
                  )}
                </td>

                {/* Mode */}
                <td className="px-4 py-4" style={{ color: "#9CA3AF" }}>
                  {p.mode === "offline" ? "In-person" : "Online"}
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, fontSize: 10 }}
                  >
                    {statusStyle.label}
                  </span>
                  {p.approved_at && (
                    <p className="mt-0.5" style={{ color: "#4B5563" }}>
                      by {p.approved_by?.split("@")[0]} · {fmt(p.approved_at)}
                    </p>
                  )}
                </td>

                {/* Added */}
                <td className="px-4 py-4" style={{ color: "#6B7280" }}>{fmt(p.created_at)}</td>

                {/* Actions */}
                <td className="px-4 py-4 min-w-[240px]">
                  <ClinicParticipantActions
                    id={p.id}
                    currentStatus={p.status}
                    whatsappGroupUrl={p.whatsapp_group_url}
                    onStatusChange={handleStatusChange}
                  />
                  {p.status === "active" && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "#1E293B" }}>
                      <IssueCertButton
                        fullName={p.full_name}
                        email={p.email}
                        clinicSlug="digital-visibility-clinic"
                        initialCertNum={p.cert_number}
                      />
                    </div>
                  )}
                  {p.notes && (
                    <p className="mt-2 text-[10px] italic" style={{ color: "#4B5563" }}>{p.notes}</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
