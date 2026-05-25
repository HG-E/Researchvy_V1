"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";

type ClinicEnquiry = {
  id: string; full_name: string; email: string;
  clinic_slug: string; notes: string | null;
  status: string; created_at: string;
};
type AcademyEnquiry = {
  id: string; full_name: string; email: string;
  programme_slug: string; notes: string | null;
  status: string; created_at: string;
};
type PartnershipEnquiry = {
  id: string; contact_name: string; contact_email: string;
  institution: string; researcher_count: string;
  interest_area: string; message: string | null;
  status: string; created_at: string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:     { bg: "rgba(245,158,11,0.12)",  text: "#F59E0B" },
  contacted:   { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA" },
  enrolled:    { bg: "rgba(16,185,129,0.12)",  text: "#10B981" },
  declined:    { bg: "rgba(239,68,68,0.12)",   text: "#F87171" },
  new:         { bg: "rgba(245,158,11,0.12)",  text: "#F59E0B" },
  in_progress: { bg: "rgba(167,139,250,0.12)", text: "#A78BFA" },
  closed:      { bg: "rgba(107,114,128,0.12)", text: "#6B7280" },
};

const CLINIC_STATUSES    = ["pending", "contacted", "enrolled", "declined"];
const PARTNER_STATUSES   = ["new", "contacted", "in_progress", "closed"];

function StatusSelect({
  id, table, current, options,
}: { id: string; table: string; current: string; options: string[] }) {
  const router   = useRouter();
  const [value,  setValue]   = useState(current);
  const [saving, setSaving]  = useState(false);

  async function handleChange(next: string) {
    if (next === value) return;
    setSaving(true);
    await fetch("/api/admin/enquiries", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ table, id, status: next }),
    });
    setValue(next);
    setSaving(false);
    router.refresh();
  }

  const sc = STATUS_COLORS[value] ?? STATUS_COLORS.pending;

  return (
    <div className="relative inline-flex items-center gap-1">
      {saving && <Loader2 className="h-3 w-3 animate-spin" style={{ color: "#6B7280" }} />}
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none text-[11px] font-semibold px-2 py-0.5 rounded-full pr-5 cursor-pointer border-0 outline-none capitalize"
        style={{ backgroundColor: sc.bg, color: sc.text }}
        disabled={saving}
      >
        {options.map((s) => (
          <option key={s} value={s} className="capitalize" style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-1 h-2.5 w-2.5 pointer-events-none" style={{ color: sc.text }} />
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="py-12 text-center text-sm" style={{ color: "#4B5563" }}>
        No enquiries yet
      </td>
    </tr>
  );
}

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: "#4B5563" }}>
    {children}
  </th>
);

const TD = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <td className="px-4 py-3 text-sm" style={{ color: muted ? "#6B7280" : "#D1D5DB" }}>
    {children}
  </td>
);

const TABLE_WRAP = "rounded-2xl border overflow-hidden";
const TABLE_STYLE = { backgroundColor: "#0F172A", borderColor: "#1E293B" };

export function EnquiriesClient({
  clinic, academy, partnership,
}: {
  clinic:      ClinicEnquiry[];
  academy:     AcademyEnquiry[];
  partnership: PartnershipEnquiry[];
}) {
  const [tab, setTab] = useState<"clinic" | "academy" | "partnership">("clinic");

  const TABS = [
    { key: "clinic",      label: "Clinic",       count: clinic.length },
    { key: "academy",     label: "Academy",      count: academy.length },
    { key: "partnership", label: "Partnerships", count: partnership.length },
  ] as const;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "#1E293B" }}>
        {TABS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2"
            style={{
              color:       tab === key ? "#60A5FA" : "#6B7280",
              borderColor: tab === key ? "#2563EB" : "transparent",
            }}
          >
            {label}
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: tab === key ? "rgba(37,99,235,0.15)" : "#1E293B",
                color:           tab === key ? "#60A5FA" : "#6B7280",
              }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Clinic table */}
      {tab === "clinic" && (
        <div className={TABLE_WRAP} style={TABLE_STYLE}>
          <table className="w-full">
            <thead style={{ borderBottom: "1px solid #1E293B" }}>
              <tr>
                <TH>Name</TH><TH>Email</TH><TH>Clinic</TH>
                <TH>Notes</TH><TH>Status</TH><TH>Date</TH>
              </tr>
            </thead>
            <tbody>
              {clinic.length === 0 ? <EmptyRow cols={6} /> : clinic.map((e, i) => (
                <tr key={e.id} style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}>
                  <TD>{e.full_name || "—"}</TD>
                  <TD muted>{e.email}</TD>
                  <TD muted>{e.clinic_slug.replace(/-/g, " ")}</TD>
                  <TD muted>{e.notes ? e.notes.slice(0, 40) + (e.notes.length > 40 ? "…" : "") : "—"}</TD>
                  <td className="px-4 py-3">
                    <StatusSelect id={e.id} table="clinic_enquiries" current={e.status} options={CLINIC_STATUSES} />
                  </td>
                  <TD muted>{fmt(e.created_at)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Academy table */}
      {tab === "academy" && (
        <div className={TABLE_WRAP} style={TABLE_STYLE}>
          <table className="w-full">
            <thead style={{ borderBottom: "1px solid #1E293B" }}>
              <tr>
                <TH>Name</TH><TH>Email</TH><TH>Programme</TH>
                <TH>Notes</TH><TH>Status</TH><TH>Date</TH>
              </tr>
            </thead>
            <tbody>
              {academy.length === 0 ? <EmptyRow cols={6} /> : academy.map((e, i) => (
                <tr key={e.id} style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}>
                  <TD>{e.full_name || "—"}</TD>
                  <TD muted>{e.email}</TD>
                  <TD muted>{e.programme_slug.replace(/-/g, " ")}</TD>
                  <TD muted>{e.notes ? e.notes.slice(0, 40) + (e.notes.length > 40 ? "…" : "") : "—"}</TD>
                  <td className="px-4 py-3">
                    <StatusSelect id={e.id} table="academy_enquiries" current={e.status} options={CLINIC_STATUSES} />
                  </td>
                  <TD muted>{fmt(e.created_at)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Partnership table */}
      {tab === "partnership" && (
        <div className={TABLE_WRAP} style={TABLE_STYLE}>
          <table className="w-full">
            <thead style={{ borderBottom: "1px solid #1E293B" }}>
              <tr>
                <TH>Contact</TH><TH>Email</TH><TH>Institution</TH>
                <TH>Interest</TH><TH>Status</TH><TH>Date</TH>
              </tr>
            </thead>
            <tbody>
              {partnership.length === 0 ? <EmptyRow cols={6} /> : partnership.map((e, i) => (
                <tr key={e.id} style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}>
                  <TD>{e.contact_name}</TD>
                  <TD muted>{e.contact_email}</TD>
                  <TD muted>{e.institution || "—"}</TD>
                  <TD muted>{e.interest_area ? e.interest_area.slice(0, 35) + (e.interest_area.length > 35 ? "…" : "") : "—"}</TD>
                  <td className="px-4 py-3">
                    <StatusSelect id={e.id} table="partnership_enquiries" current={e.status} options={PARTNER_STATUSES} />
                  </td>
                  <TD muted>{fmt(e.created_at)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
