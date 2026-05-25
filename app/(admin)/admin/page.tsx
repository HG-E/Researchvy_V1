import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Inbox, Award, Users, BookOpen, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const db = createSupabaseAdminClient();

  const [
    { count: clinicPending },
    { count: clinicTotal },
    { count: academyPending },
    { count: partnerPending },
    { count: certsTotal },
    { count: subscribers },
    { count: usersTotal },
  ] = await Promise.all([
    db.from("clinic_enquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("clinic_enquiries").select("*", { count: "exact", head: true }),
    db.from("academy_enquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("partnership_enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    db.from("certificates").select("*", { count: "exact", head: true }),
    db.from("newsletters").select("*", { count: "exact", head: true }).eq("subscribed", true),
    db.from("users").select("*", { count: "exact", head: true }),
  ]);

  // Recent activity — last 5 clinic enquiries
  const { data: recent } = await db
    .from("clinic_enquiries")
    .select("id, full_name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    clinicPending:  clinicPending  ?? 0,
    clinicTotal:    clinicTotal    ?? 0,
    academyPending: academyPending ?? 0,
    partnerPending: partnerPending ?? 0,
    certsTotal:     certsTotal     ?? 0,
    subscribers:    subscribers    ?? 0,
    usersTotal:     usersTotal     ?? 0,
    recent:         recent         ?? [],
  };
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "rgba(245,158,11,0.1)",  text: "#F59E0B" },
  contacted:  { bg: "rgba(59,130,246,0.1)",  text: "#60A5FA" },
  enrolled:   { bg: "rgba(16,185,129,0.1)",  text: "#10B981" },
  declined:   { bg: "rgba(239,68,68,0.1)",   text: "#F87171" },
};

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const STAT_CARDS = [
    {
      label:   "Pending Clinic Enquiries",
      value:   stats.clinicPending,
      sub:     `${stats.clinicTotal} total`,
      icon:    Inbox,
      color:   "#F59E0B",
      href:    "/admin/enquiries",
      urgent:  stats.clinicPending > 0,
    },
    {
      label:   "Pending Academy Enquiries",
      value:   stats.academyPending,
      sub:     "Awaiting contact",
      icon:    BookOpen,
      color:   "#A78BFA",
      href:    "/admin/enquiries",
      urgent:  stats.academyPending > 0,
    },
    {
      label:   "Partnership Enquiries",
      value:   stats.partnerPending,
      sub:     "New & uncontacted",
      icon:    TrendingUp,
      color:   "#34D399",
      href:    "/admin/enquiries",
      urgent:  stats.partnerPending > 0,
    },
    {
      label:   "Certificates Issued",
      value:   stats.certsTotal,
      sub:     "All time",
      icon:    Award,
      color:   "#60A5FA",
      href:    "/admin/certificates",
      urgent:  false,
    },
    {
      label:   "Newsletter Subscribers",
      value:   stats.subscribers,
      sub:     "Active",
      icon:    Users,
      color:   "#F472B6",
      href:    "#",
      urgent:  false,
    },
    {
      label:   "Registered Users",
      value:   stats.usersTotal,
      sub:     "Platform accounts",
      icon:    Users,
      color:   "#2563EB",
      href:    "#",
      urgent:  false,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Platform activity at a glance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, color, href, urgent }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border p-5 flex items-start gap-4 transition-colors hover:border-opacity-60"
            style={{
              backgroundColor: "#0F172A",
              borderColor: urgent ? `${color}40` : "#1E293B",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold" style={{ color: urgent ? color : "#F9FAFB" }}>
                {value}
              </p>
              <p className="text-xs font-medium mt-0.5 leading-snug" style={{ color: "#D1D5DB" }}>
                {label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "#4B5563" }}>
                {sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
            Recent Clinic Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-xs font-medium transition-colors hover:text-white"
            style={{ color: "#2563EB" }}
          >
            View all →
          </Link>
        </div>
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          {stats.recent.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
              <p className="text-sm" style={{ color: "#4B5563" }}>No enquiries yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1E293B" }}>
                  {["Name", "Email", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold tracking-wide"
                      style={{ color: "#4B5563" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((e, i) => {
                  const sc = STATUS_COLORS[e.status] ?? STATUS_COLORS.pending;
                  return (
                    <tr
                      key={e.id}
                      style={{ borderTop: i === 0 ? "none" : "1px solid #0F172A" }}
                    >
                      <td className="px-5 py-3 font-medium" style={{ color: "#F9FAFB" }}>
                        {e.full_name || "—"}
                      </td>
                      <td className="px-5 py-3" style={{ color: "#9CA3AF" }}>
                        {e.email}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: "#4B5563" }}>
                        {new Date(e.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
