import Link from "next/link";
import { GraduationCap, BookOpen, Award, ArrowRight, ChevronRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({ title: "Dashboard", noIndex: true });

const QUICK_ACTIONS = [
  {
    href: "/clinics",
    label: "Register for a Clinic",
    description: "Join our next Digital Visibility Clinic™",
    color: "#2563EB",
  },
  {
    href: "/insights",
    label: "Read Insights",
    description: "Latest research visibility articles",
    color: "#10B981",
  },
  {
    href: "/resources",
    label: "Browse Resources",
    description: "Templates, guides, and tools",
    color: "#8B5CF6",
  },
  {
    href: "/dashboard/profile",
    label: "Complete Your Profile",
    description: "Add ORCID, Google Scholar, and bio",
    color: "#F59E0B",
  },
];

const STATS = [
  { label: "Clinics Registered", value: "0", Icon: GraduationCap, color: "#2563EB" },
  { label: "Resources Saved",    value: "0", Icon: BookOpen,       color: "#10B981" },
  { label: "Certificates",       value: "0", Icon: Award,          color: "#F59E0B" },
];

export default async function DashboardPage() {
  const user = await getServerUser();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Scholar";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Your Dashboard
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Welcome back, {displayName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Your scholarly visibility command centre
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-5 flex items-center gap-4"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>
                {value}
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-base" style={{ color: "#F9FAFB" }}>
              Getting Started
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              Complete these steps to maximise your visibility
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
          >
            0 / 4
          </span>
        </div>
        <div className="space-y-3">
          {[
            { label: "Complete your scholar profile", href: "/dashboard/profile", done: false },
            { label: "Register for your first clinic", href: "/clinics", done: false },
            { label: "Read a research visibility insight", href: "/insights", done: false },
            { label: "Download a resource", href: "/resources", done: false },
          ].map((step, i) => (
            <Link
              key={i}
              href={step.href}
              className="flex items-center gap-3 rounded-xl p-3.5 border transition-all duration-150"
              style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#334155")}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                style={{ borderColor: "#334155" }}
              />
              <span className="text-sm flex-1" style={{ color: "#D1D5DB" }}>
                {step.label}
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-bold text-base mb-4" style={{ color: "#F9FAFB" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(({ href, label, description, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E293B")}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                  {label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {description}
                </p>
              </div>
              <ArrowRight
                className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "#4B5563" }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Framework reminder */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
          Your Journey
        </p>
        <div className="flex flex-wrap gap-2">
          {siteConfig.framework.map((step, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: "#0F172A",
                borderColor: i === siteConfig.framework.length - 1 ? "#10B981" : "#1E293B",
                color: i === siteConfig.framework.length - 1 ? "#10B981" : "#6B7280",
              }}
            >
              {step}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "#4B5563" }}>
          Researchvy guides you from research creation to measurable societal impact.
        </p>
      </div>
    </div>
  );
}
