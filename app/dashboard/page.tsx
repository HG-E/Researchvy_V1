import Link from "next/link";
import { GraduationCap, Layers, Award, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseServerClient } from "@/lib/auth/supabase";
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

export default async function DashboardPage() {
  const user = await getServerUser();
  const userId = user?.id;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Scholar";

  const meta = user?.user_metadata ?? {};
  const profileDone = !!(meta.full_name && String(meta.full_name).trim());

  let clinicCount = 0;
  let academyEnrolled = false;

  if (userId) {
    try {
      const db = await createSupabaseServerClient();
      const [clinicRes, academyRes] = await Promise.all([
        db.from("clinic_enquiries").select("id", { count: "exact", head: true }).eq("user_id", userId),
        db.from("academy_enquiries").select("id", { count: "exact", head: true }).eq("user_id", userId),
      ]);
      clinicCount = clinicRes.count ?? 0;
      academyEnrolled = (academyRes.count ?? 0) > 0;
    } catch {
      // Non-fatal — counts default to 0
    }
  }

  const STATS = [
    { label: "Clinics Registered", value: String(clinicCount), Icon: GraduationCap, color: "#2563EB" },
    { label: "Academy",            value: academyEnrolled ? "Waitlisted" : "—",     Icon: Layers,       color: "#8B5CF6" },
    { label: "Certificates",       value: "0",                                        Icon: Award,        color: "#F59E0B" },
  ];

  const steps = [
    { label: "Complete your scholar profile",     href: "/dashboard/profile",  done: profileDone },
    { label: "Register for your first clinic",    href: "/clinics",            done: clinicCount > 0 },
    { label: "Enrol in the Academy",              href: "/dashboard/academy",  done: academyEnrolled },
    { label: "Read a research visibility insight",href: "/insights",           done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;

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
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
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
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* New-user nudge — only shown when no clinic registered */}
      {clinicCount === 0 && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 border-l-4"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "#2563EB" }}
        >
          <span className="text-base mt-px flex-shrink-0">👋</span>
          <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
            <strong style={{ color: "#60A5FA" }}>Welcome to Researchvy.</strong>{" "}
            The fastest way to start is to register for the{" "}
            <Link href="/clinics" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: "#60A5FA" }}>
              Digital Visibility Clinic
            </Link>
            {" "}our flagship live programme that takes researchers from overlooked to globally discoverable.
          </p>
        </div>
      )}

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
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Complete these steps to maximise your visibility
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: doneCount === steps.length ? "rgba(16,185,129,0.15)" : "#1E293B",
              color: doneCount === steps.length ? "#10B981" : "#6B7280",
            }}
          >
            {doneCount} / {steps.length}
          </span>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <Link
              key={i}
              href={step.href}
              className={`flex items-center gap-3 rounded-xl p-3.5 border transition-all duration-150 ${step.done ? "hover:border-[rgba(16,185,129,0.4)]" : "hover:border-[#2563EB]"}`}
              style={{
                backgroundColor: step.done ? "rgba(16,185,129,0.05)" : "#1E293B",
                borderColor: step.done ? "rgba(16,185,129,0.2)" : "#334155",
              }}
            >
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#10B981" }} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#334155" }} />
              )}
              <span
                className="text-sm flex-1"
                style={{ color: step.done ? "#6B7280" : "#D1D5DB", textDecoration: step.done ? "line-through" : "none" }}
              >
                {step.label}
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "#6B7280" }} aria-hidden="true" />
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
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200 hover:border-[#2563EB]"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                  {label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {description}
                </p>
              </div>
              <ArrowRight
                className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "#6B7280" }}
                aria-hidden="true"
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
                color: i === siteConfig.framework.length - 1 ? "#10B981" : "#9CA3AF",
              }}
            >
              {step}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>
          Researchvy guides you from research creation to measurable societal impact.
        </p>
      </div>
    </div>
  );
}
