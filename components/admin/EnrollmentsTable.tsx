"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, CheckCircle2, XCircle, Filter, Download } from "lucide-react";
import { EnrollmentActions } from "@/components/admin/EnrollmentActions";

export type EnrollmentRow = {
  id:           string;
  user_id:      string;
  user_email:   string;
  user_name:    string;
  course_id:    string;
  tier:         string;
  source:       string;
  enrolled_at:  string;
  expires_at:   string | null;
  completed_at: string | null;
  courses: { id: string; title: string; level: number; slug: string } | null;
};

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  pro:           { bg: "rgba(139,92,246,0.12)", text: "#A78BFA" },
  institutional: { bg: "rgba(239,68,68,0.12)",  text: "#FCA5A5" },
  builder:       { bg: "rgba(245,158,11,0.12)", text: "#FCD34D" },
  starter:       { bg: "rgba(37,99,235,0.12)",  text: "#60A5FA" },
  complimentary: { bg: "rgba(16,185,129,0.12)", text: "#34D399" },
};

function isActive(r: EnrollmentRow) {
  return !r.expires_at || new Date(r.expires_at) > new Date();
}

function downloadCsv(rows: EnrollmentRow[]) {
  const headers = ["Name", "Email", "Course", "Level", "Tier", "Status", "Enrolled", "Expires"];
  const lines = rows.map((r) => [
    r.user_name,
    r.user_email,
    r.courses?.title ?? r.course_id,
    r.courses?.level ?? "",
    r.tier,
    r.completed_at ? "completed" : isActive(r) ? "active" : "revoked",
    format(new Date(r.enrolled_at), "yyyy-MM-dd"),
    r.expires_at ? format(new Date(r.expires_at), "yyyy-MM-dd") : "lifetime",
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `enrollments-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  rows: EnrollmentRow[];
  courseOptions: { id: string; title: string; level: number }[];
}

export function EnrollmentsTable({ rows, courseOptions }: Props) {
  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "revoked">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      if (q && !r.user_email.toLowerCase().includes(q) && !r.user_name.toLowerCase().includes(q)) return false;
      if (courseFilter !== "all" && r.course_id !== courseFilter) return false;
      if (statusFilter === "active"    && !(isActive(r) && !r.completed_at)) return false;
      if (statusFilter === "completed" && !r.completed_at) return false;
      if (statusFilter === "revoked"   && (isActive(r) || r.completed_at))   return false;
      return true;
    });
  }, [rows, search, courseFilter, statusFilter]);

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: "#4B5563" }}
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#F9FAFB" }}
          />
        </div>

        {/* Course filter */}
        {courseOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs border outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#D1D5DB" }}
            >
              <option value="all">All Courses</option>
              {courseOptions.map((c) => (
                <option key={c.id} value={c.id}>L{c.level} — {c.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-xl px-3 py-2 text-xs border outline-none focus:ring-1 focus:ring-blue-500"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#D1D5DB" }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="revoked">Revoked</option>
        </select>

        {/* Result count + export */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs" style={{ color: "#4B5563" }}>
            {filtered.length} / {rows.length}
          </span>
          {rows.length > 0 && (
            <button
              onClick={() => downloadCsv(filtered)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#6B7280" }}
              title="Export filtered rows as CSV"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Empty filtered state */}
      {filtered.length === 0 && rows.length > 0 && (
        <div
          className="rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-sm" style={{ color: "#4B5563" }}>No enrollments match your filters.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          {/* Table head */}
          <div
            className="hidden md:grid gap-4 px-5 py-3 text-xs font-semibold tracking-wider uppercase border-b"
            style={{
              gridTemplateColumns: "minmax(0,2fr) minmax(0,2fr) auto auto auto auto auto",
              backgroundColor:     "#0F172A",
              borderColor:         "#1E293B",
              color:               "#4B5563",
            }}
          >
            <span>Researcher</span>
            <span>Course</span>
            <span>Tier</span>
            <span>Status</span>
            <span>Enrolled</span>
            <span>Expires</span>
            <span />
          </div>

          <div style={{ backgroundColor: "#0F172A" }}>
            {filtered.map((row, i) => {
              const tierStyle = TIER_COLORS[row.tier] ?? TIER_COLORS.starter;
              const active    = isActive(row);

              return (
                <div
                  key={row.id}
                  className="grid gap-4 items-center px-5 py-4 border-b last:border-0"
                  style={{
                    gridTemplateColumns: "minmax(0,2fr) minmax(0,2fr) auto auto auto auto auto",
                    borderColor:         "#1E293B",
                    backgroundColor:     i % 2 === 0 ? "#0F172A" : "#0A1120",
                    opacity:             active ? 1 : 0.55,
                  }}
                >
                  {/* Researcher */}
                  <div className="min-w-0">
                    {row.user_name && (
                      <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                        {row.user_name}
                      </p>
                    )}
                    <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                      {row.user_email || row.user_id}
                    </p>
                  </div>

                  {/* Course */}
                  <div className="min-w-0">
                    <p className="text-xs truncate" style={{ color: "#D1D5DB" }}>
                      {row.courses?.title ?? row.course_id}
                    </p>
                    {row.courses && (
                      <p className="text-[10px]" style={{ color: "#4B5563" }}>
                        Level {row.courses.level}
                      </p>
                    )}
                  </div>

                  {/* Tier */}
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap capitalize"
                    style={{ backgroundColor: tierStyle.bg, color: tierStyle.text }}
                  >
                    {row.tier}
                  </span>

                  {/* Status */}
                  <div className="flex items-center justify-center">
                    {row.completed_at ? (
                      <span title="Course completed">
                        <CheckCircle2 className="h-4 w-4" style={{ color: "#10B981" }} />
                      </span>
                    ) : active ? (
                      <span
                        className="text-[10px] font-bold rounded-full px-2 py-0.5"
                        style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
                      >
                        Active
                      </span>
                    ) : (
                      <span title="Revoked">
                        <XCircle className="h-4 w-4" style={{ color: "#374151" }} />
                      </span>
                    )}
                  </div>

                  {/* Enrolled at */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                    {format(new Date(row.enrolled_at), "MMM d, yyyy")}
                  </span>

                  {/* Expires at */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                    {row.expires_at ? format(new Date(row.expires_at), "MMM d, yyyy") : "—"}
                  </span>

                  {/* Actions */}
                  {active && !row.completed_at
                    ? <EnrollmentActions enrollmentId={row.id} />
                    : <div />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
