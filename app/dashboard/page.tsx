export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  GraduationCap, BookOpen, Award, ArrowRight,
  ChevronRight, CheckCircle2, PlayCircle,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getEnrolledCoursesWithProgress } from "@/lib/academy/courses";
import { levelColor } from "@/constants/academy";
import { UserAvatar } from "@/components/common/UserAvatar";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({ title: "Dashboard", noIndex: true });

const QUICK_ACTIONS = [
  { href: "/clinics",           label: "Register for a Clinic",    description: "Join the Digital Visibility Clinic™",      color: "#2563EB" },
  { href: "/insights",          label: "Read Insights",            description: "Latest research visibility articles",       color: "#10B981" },
  { href: "/resources",         label: "Browse Resources",         description: "Templates, guides, and tools",             color: "#8B5CF6" },
  { href: "/dashboard/profile", label: "Complete Your Profile",    description: "Add ORCID, Google Scholar, and bio",       color: "#F59E0B" },
];

export default async function DashboardPage() {
  const user   = await getServerUser();
  const userId = user?.id;

  // Profile
  let profile: { full_name: string; avatar_url: string | null } | null = null;
  if (userId) {
    try {
      const admin = createSupabaseAdminClient();
      const { data } = await admin.from("users").select("full_name, avatar_url").eq("id", userId).single();
      profile = data ?? null;
    } catch { /* non-fatal */ }
  }

  const fullName    = profile?.full_name || (user?.user_metadata?.full_name as string) || "";
  const avatarUrl   = profile?.avatar_url ?? null;
  const displayName = fullName.split(" ")[0] || user?.email?.split("@")[0] || "Scholar";
  const profileDone = !!(fullName.trim());

  // Clinic enquiries
  let clinicCount = 0;
  if (userId) {
    try {
      const admin = createSupabaseAdminClient();
      const { count } = await admin
        .from("clinic_enquiries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      clinicCount = count ?? 0;
    } catch { /* non-fatal */ }
  }

  // Academy — real enrollments
  const courseEntries = userId ? await getEnrolledCoursesWithProgress(userId) : [];
  const activeCount     = courseEntries.length;
  const completedCount  = courseEntries.filter((e) => e.enrollment.completed_at).length;

  // "Jump Back In" — most active incomplete course (highest % but not 100%)
  const jumpBackEntry = courseEntries.find((e) => !e.enrollment.completed_at && e.stats.completed_lessons > 0)
    ?? courseEntries.find((e) => !e.enrollment.completed_at)
    ?? null;

  // Getting Started steps (wired to real data)
  const steps = [
    { label: "Complete your scholar profile",      href: "/dashboard/profile",  done: profileDone },
    { label: "Register for your first clinic",     href: "/clinics",            done: clinicCount > 0 },
    { label: "Start your first Academy course",    href: "/academy/courses",    done: activeCount > 0 },
    { label: "Read a research visibility insight", href: "/insights",           done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  const STATS = [
    { label: "Clinics Registered", value: String(clinicCount),     Icon: GraduationCap, color: "#2563EB" },
    { label: "Courses Enrolled",   value: String(activeCount),     Icon: BookOpen,      color: "#8B5CF6" },
    { label: "Certificates",       value: String(completedCount),  Icon: Award,         color: "#F59E0B" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Welcome header */}
      <div className="flex items-center gap-4">
        <UserAvatar name={fullName} email={user?.email} avatarUrl={avatarUrl} size="lg" />
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Your Dashboard
          </p>
          <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Welcome back, {displayName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
            {fullName || user?.email} · Your scholarly visibility command centre
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}1A` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jump Back In — only shown when actively enrolled */}
      {jumpBackEntry && (() => {
        const { course, stats, nextLesson } = jumpBackEntry;
        const color = levelColor(course.level);
        return (
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderLeft: `3px solid ${color}` }}
          >
            <div className="px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4B5563" }}>
                Jump Back In
              </p>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color }}>
                    Level {course.level}
                  </p>
                  <h2 className="text-base font-bold leading-snug mb-1" style={{ color: "#F9FAFB" }}>
                    {course.title}
                  </h2>
                  {nextLesson && (
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Next: {nextLesson.title}
                    </p>
                  )}
                </div>
                {/* Progress mini */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div>
                    <p className="text-lg font-bold text-right" style={{ color }}>
                      {stats.percent_complete}%
                    </p>
                    <p className="text-[10px] text-right" style={{ color: "#4B5563" }}>
                      {stats.completed_lessons}/{stats.total_lessons} done
                    </p>
                  </div>
                  {nextLesson && (
                    <Link
                      href={`/academy/courses/${course.slug}/lessons/${nextLesson.id}`}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-90"
                      style={{ backgroundColor: color }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Continue
                    </Link>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${stats.percent_complete}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* New-user nudge — only when no clinic AND no courses */}
      {clinicCount === 0 && activeCount === 0 && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 border-l-4"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "#2563EB" }}
        >
          <span className="text-base mt-px flex-shrink-0">👋</span>
          <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
            <strong style={{ color: "#60A5FA" }}>Welcome to Researchvy.</strong>{" "}
            Start with the{" "}
            <Link href="/clinics" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: "#60A5FA" }}>
              Digital Visibility Clinic
            </Link>
            {" "}— our live programme that takes researchers from overlooked to globally discoverable.
          </p>
        </div>
      )}

      {/* Getting Started */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-base" style={{ color: "#F9FAFB" }}>Getting Started</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Complete these steps to maximise your visibility</p>
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
              <span className="text-sm flex-1" style={{ color: step.done ? "#6B7280" : "#D1D5DB", textDecoration: step.done ? "line-through" : "none" }}>
                {step.label}
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "#6B7280" }} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-bold text-base mb-4" style={{ color: "#F9FAFB" }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(({ href, label, description, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200 hover:border-[#2563EB]"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{description}</p>
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
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
          Your Journey
        </p>
        <div className="flex flex-wrap gap-2">
          {siteConfig.framework.map((step: string, i: number) => (
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
