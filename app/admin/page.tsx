import Link from "next/link";
import { FileText, BookOpen, Layers, Users, ArrowRight, Clock, BarChart2, Inbox, Handshake } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsights } from "@/lib/cms/mdx";
import { RESOURCES } from "@/constants/resources";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { format } from "date-fns";

export const metadata = generatePageMetadata({ title: "Admin Overview" });

async function getUserCount(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    return data?.total ?? 0;
  } catch {
    return 0;
  }
}

async function getEnquiryCounts() {
  try {
    const admin = createSupabaseAdminClient();
    const [clinicRes, academyRes, partnerRes] = await Promise.all([
      admin.from("clinic_enquiries").select("status"),
      admin.from("academy_enquiries").select("status"),
      admin.from("partnership_enquiries").select("status"),
    ]);
    const clinicPending   = (clinicRes.data   ?? []).filter((r: { status: string }) => r.status === "pending").length;
    const academyPending  = (academyRes.data  ?? []).filter((r: { status: string }) => r.status === "pending").length;
    const partnerNew      = (partnerRes.data  ?? []).filter((r: { status: string }) => r.status === "new").length;
    return {
      clinic:   { total: clinicRes.data?.length  ?? 0, pending: clinicPending },
      academy:  { total: academyRes.data?.length  ?? 0, pending: academyPending },
      partner:  { total: partnerRes.data?.length  ?? 0, newCount: partnerNew },
    };
  } catch {
    return { clinic: { total: 0, pending: 0 }, academy: { total: 0, pending: 0 }, partner: { total: 0, newCount: 0 } };
  }
}

export default async function AdminOverviewPage() {
  const [insights, userCount, enquiries] = await Promise.all([
    getInsights({ limit: 100 }),
    getUserCount(),
    getEnquiryCounts(),
  ]);

  const recent = insights.slice(0, 5);

  const stats = [
    { label: "Insights Published",  value: insights.length,          icon: FileText, color: "#60A5FA" },
    { label: "Active Clinics",      value: 1,                         icon: BookOpen, color: "#34D399" },
    { label: "Resources Available", value: RESOURCES.length,          icon: Layers,   color: "#A78BFA" },
    { label: "Registered Users",    value: userCount,                 icon: Users,    color: "#F472B6" },
  ];

  const enquiryCards = [
    {
      label: "Clinic Enquiries",
      href:  "/admin/enquiries",
      total: enquiries.clinic.total,
      badge: enquiries.clinic.pending,
      badgeLabel: "pending",
      icon: Inbox,
      color: "#60A5FA",
    },
    {
      label: "Academy Enquiries",
      href:  "/admin/enquiries",
      total: enquiries.academy.total,
      badge: enquiries.academy.pending,
      badgeLabel: "pending",
      icon: BookOpen,
      color: "#A78BFA",
    },
    {
      label: "Partnership Enquiries",
      href:  "/admin/partnerships",
      total: enquiries.partner.total,
      badge: enquiries.partner.newCount,
      badgeLabel: "new",
      icon: Handshake,
      color: "#34D399",
    },
  ];

  const quickLinks = [
    { label: "Manage Content",   href: "/admin/content",      desc: "View and manage insights" },
    { label: "Manage Clinics",   href: "/admin/clinics",      desc: "Programme details and sessions" },
    { label: "Manage Users",     href: "/admin/users",        desc: "User accounts and roles" },
    { label: "Analytics",        href: "/admin/analytics",    desc: "Traffic and engagement metrics" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Platform Overview
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          Real-time summary of your Researchvy platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "#6B7280" }}>{label}</p>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Enquiry Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {enquiryCards.map(({ label, href, total, badge, badgeLabel, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border p-5 flex items-center gap-4 transition-all hover:border-[#334155]"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>{total}</p>
              <p className="text-xs truncate" style={{ color: "#6B7280" }}>{label}</p>
            </div>
            {badge > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#FCD34D" }}
              >
                {badge} {badgeLabel}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent content */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Recent Insights</h2>
            <Link
              href="/admin/content"
              className="flex items-center gap-1 text-xs transition-colors hover:text-[#93C5FD]"
              style={{ color: "#2563EB" }}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((insight) => (
              <div
                key={insight.slug}
                className="flex items-start justify-between gap-4 py-3 border-b last:border-0"
                style={{ borderColor: "#1E293B" }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                    {insight.title}
                  </p>
                  <p className="text-xs mt-0.5 capitalize" style={{ color: "#6B7280" }}>
                    {insight.category.replace(/-/g, " ")}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-xs" style={{ color: "#4B5563" }}>
                  <Clock className="h-3 w-3" />
                  {format(new Date(insight.published_at), "MMM d, yyyy")}
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: "#4B5563" }}>
                No insights yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <h2 className="text-sm font-semibold mb-5" style={{ color: "#F9FAFB" }}>Quick Actions</h2>
          <div className="space-y-2">
            {quickLinks.map(({ label, href, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-[#1E293B]"
                style={{ backgroundColor: "#080E1A" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F9FAFB" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "#2563EB" }} />
              </Link>
            ))}
          </div>

          {/* Analytics teaser */}
          <div
            className="mt-4 rounded-xl p-4 border"
            style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
              <p className="text-xs font-semibold" style={{ color: "#F9FAFB" }}>PostHog Analytics</p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              {process.env.NEXT_PUBLIC_POSTHOG_KEY
                ? "Connected — tracking active."
                : "Not configured. Add NEXT_PUBLIC_POSTHOG_KEY to .env.local."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
