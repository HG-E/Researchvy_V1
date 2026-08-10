import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Users, Calendar, TrendingUp, Award, ChevronRight } from "lucide-react";
import { CAREER_STAGES } from "@/constants/preClinic";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  new:       "#2563EB",
  contacted: "#F59E0B",
  attended:  "#8B5CF6",
  no_show:   "#4B5563",
  converted: "#10B981",
};

const STATUS_LABELS: Record<string, string> = {
  new:       "New",
  contacted: "Contacted",
  attended:  "Attended",
  no_show:   "No-show",
  converted: "Converted",
};

const SESSION_LABELS: Record<string, string> = {
  saturday: "Saturday",
  sunday:   "Sunday",
  both:     "Both",
};

const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  CAREER_STAGES.map(s => [s.id, s.label])
);

interface Registration {
  id:                 string;
  created_at:         string;
  full_name:          string;
  email:              string;
  session:            string;
  career_stage:       string;
  field_of_research:  string;
  status:             string;
}

async function getRegistrations(): Promise<Registration[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("pre_clinic_registrations")
    .select("id, created_at, full_name, email, session, career_stage, field_of_research, status")
    .order("created_at", { ascending: false })
    .limit(500);
  return (data ?? []) as Registration[];
}

function buildAnalytics(regs: Registration[]) {
  const total = regs.length;

  const sessionCounts: Record<string, number> = { saturday: 0, sunday: 0, both: 0 };
  for (const r of regs) sessionCounts[r.session] = (sessionCounts[r.session] ?? 0) + 1;

  const statusCounts: Record<string, number> = { new: 0, contacted: 0, attended: 0, no_show: 0, converted: 0 };
  for (const r of regs) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount  = regs.filter(r => new Date(r.created_at) > sevenDaysAgo).length;

  return { total, sessionCounts, statusCounts, recentCount };
}

export default async function AdminPreClinicPage() {
  const regs = await getRegistrations();
  const { total, sessionCounts, statusCounts, recentCount } = buildAnalytics(regs);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>
          Free Pre-Clinic Registrations
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          ORCID workshop — Sat 15 & Sun 16 August 2026. Real-time registrant list for the paid-clinic funnel.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Registrations", value: total,                     icon: Users,      color: "#60A5FA" },
          { label: "Saturday",            value: sessionCounts.saturday,    icon: Calendar,   color: "#34D399" },
          { label: "Sunday",              value: sessionCounts.sunday,      icon: Calendar,   color: "#FBBF24" },
          { label: "Last 7 Days",         value: recentCount,               icon: TrendingUp, color: "#A78BFA" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4" style={{ color }} />
              <p className="text-xs font-medium" style={{ color: "#6B7280" }}>{label}</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Status distribution */}
      <div
        className="rounded-2xl border p-6 mb-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Award className="h-4 w-4" style={{ color: "#34D399" }} />
          <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Funnel status</p>
        </div>
        <div className="space-y-3">
          {(["new", "contacted", "attended", "no_show", "converted"] as const).map(status => {
            const count = statusCounts[status] ?? 0;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: STATUS_COLORS[status] }}>{STATUS_LABELS[status]}</span>
                  <span className="text-xs font-bold" style={{ color: "#F9FAFB" }}>
                    {count} <span style={{ color: "#4B5563" }}>({pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[status] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registrations table */}
      <div
        className="rounded-2xl border"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "#1E293B" }}>
          <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>All registrants ({total})</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>Click any row to see full details + take action</p>
        </div>

        {total === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
            <p className="text-sm" style={{ color: "#4B5563" }}>No registrations yet.</p>
            <p className="text-xs mt-1" style={{ color: "#374151" }}>
              Share the /pre-clinic link and registrants will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1E293B" }}>
                  {["Registrant", "Session", "Career Stage", "Field", "Status", "Date", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regs.map(r => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid #0F1929" }}
                    className="hover:bg-[#0F1929] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium" style={{ color: "#F9FAFB" }}>{r.full_name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#60A5FA" }}>{r.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "#D1D5DB" }}>{SESSION_LABELS[r.session] ?? r.session}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>{STAGE_LABELS[r.career_stage] ?? r.career_stage}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>{r.field_of_research}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (STATUS_COLORS[r.status] ?? "#4B5563") + "20",
                          color: STATUS_COLORS[r.status] ?? "#4B5563",
                        }}
                      >
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/pre-clinic/${r.id}`}
                        className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
                        style={{ color: "#4B5563" }}
                      >
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
