import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${Math.min(100, pct)}%`,
          backgroundColor: pct === 100 ? "#10B981" : "#2563EB",
        }}
      />
    </div>
  );
}

export default async function CourseProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getServerUser();
  if (!user) redirect("/auth/signin?next=/admin/academy");
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) redirect("/");

  const { id } = await params;
  const admin = createSupabaseAdminClient();

  // Fetch course + total published lessons
  const { data: course } = await admin
    .from("courses")
    .select("id, title, slug, modules(lessons(id, title, is_published, position, modules(position)))")
    .eq("id", id)
    .single();

  if (!course) notFound();

  // Count total published lessons
  const allLessons = (course.modules ?? []).flatMap((m: { lessons: { id: string; is_published: boolean }[] }) =>
    (m.lessons ?? []).filter((l) => l.is_published)
  );
  const totalLessons = allLessons.length;
  const lessonIds = allLessons.map((l: { id: string }) => l.id);

  // Fetch enrollments with user profile
  const { data: enrollments } = await admin
    .from("enrollments")
    .select("id, enrolled_at, completed_at, user_id")
    .eq("course_id", id)
    .order("enrolled_at", { ascending: false });

  const rows = enrollments ?? [];
  const userIds = rows.map((e: { user_id: string }) => e.user_id);

  // Fetch user profiles
  const { data: profiles } = await admin
    .from("users")
    .select("id, full_name, email, tier")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = Object.fromEntries((profiles ?? []).map((p: { id: string; full_name: string | null; email: string; tier: string }) => [p.id, p]));

  // Fetch lesson_progress for all enrolled users across this course's lessons
  const { data: progRows } = await admin
    .from("lesson_progress")
    .select("user_id, lesson_id, completed_at, last_position_seconds")
    .in("user_id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"])
    .in("lesson_id", lessonIds.length > 0 ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);

  // Build per-user progress map: { userId → { completedCount, lastActivity } }
  type ProgEntry = { user_id: string; lesson_id: string; completed_at: string | null; last_position_seconds: number | null };
  const userProgressMap: Record<string, { completedCount: number; lastActivity: string | null }> = {};
  for (const p of (progRows ?? []) as ProgEntry[]) {
    if (!userProgressMap[p.user_id]) {
      userProgressMap[p.user_id] = { completedCount: 0, lastActivity: null };
    }
    if (p.completed_at) {
      userProgressMap[p.user_id].completedCount += 1;
      const curr = userProgressMap[p.user_id].lastActivity;
      if (!curr || p.completed_at > curr) {
        userProgressMap[p.user_id].lastActivity = p.completed_at;
      }
    }
  }

  const completedCount = rows.filter((e: { completed_at: string | null }) => e.completed_at).length;

  type Enrollment = { id: string; enrolled_at: string; completed_at: string | null; user_id: string };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/academy" className="flex items-center gap-1.5" style={{ color: "#60A5FA" }}>
          <ArrowLeft className="h-4 w-4" /> Academy
        </Link>
        <span style={{ color: "#334155" }}>/</span>
        <Link href={`/admin/academy/courses/${id}`} className="hover:underline truncate max-w-[180px]" style={{ color: "#60A5FA" }}>
          {course.title}
        </Link>
        <span style={{ color: "#334155" }}>/</span>
        <span style={{ color: "#6B7280" }}>Students</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Student Progress
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{course.title}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Enrolled", value: rows.length, color: "#60A5FA" },
          { icon: CheckCircle2, label: "Completed", value: completedCount, color: "#10B981" },
          { icon: BookOpen, label: "In Progress", value: rows.length - completedCount, color: "#A78BFA" },
          { icon: Clock, label: "Total Lessons", value: totalLessons, color: "#FBBF24" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border px-4 py-3" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-3.5 w-3.5" style={{ color }} />
              <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#4B5563" }}>{label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-xl border py-16 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
          <p className="text-sm font-medium" style={{ color: "#6B7280" }}>No students enrolled yet</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          {/* Table header */}
          <div className="grid gap-3 px-4 py-2.5 border-b text-[11px] font-semibold uppercase tracking-wide"
            style={{ gridTemplateColumns: "1fr 140px 100px 160px 80px", backgroundColor: "#070B14", borderColor: "#1E293B", color: "#4B5563" }}>
            <span>Student</span>
            <span>Enrolled</span>
            <span>Tier</span>
            <span>Progress</span>
            <span>Status</span>
          </div>

          {(rows as Enrollment[]).map((enrollment) => {
            const profile = profileMap[enrollment.user_id] as { id: string; full_name: string | null; email: string; tier: string } | undefined;
            const prog = userProgressMap[enrollment.user_id] ?? { completedCount: 0, lastActivity: null };
            const pct = totalLessons > 0 ? Math.round((prog.completedCount / totalLessons) * 100) : 0;
            const isCert = !!enrollment.completed_at;

            return (
              <div key={enrollment.id} className="grid gap-3 px-4 py-3 border-b items-center"
                style={{ gridTemplateColumns: "1fr 140px 100px 160px 80px", borderColor: "#0F172A", backgroundColor: "#070B14" }}>
                {/* Student */}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>
                    {profile?.full_name || "—"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#4B5563" }}>{profile?.email || enrollment.user_id.slice(0, 8)}</p>
                </div>

                {/* Enrolled date */}
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                </p>

                {/* Tier */}
                <span className="text-[10px] px-2 py-0.5 rounded-full w-fit font-medium capitalize"
                  style={{
                    backgroundColor: profile?.tier === "pro" ? "rgba(37,99,235,0.15)" : "rgba(107,114,128,0.12)",
                    color: profile?.tier === "pro" ? "#60A5FA" : "#9CA3AF",
                  }}>
                  {profile?.tier ?? "free"}
                </span>

                {/* Progress */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                      {prog.completedCount}/{totalLessons} lessons
                    </span>
                    <span className="text-xs font-medium" style={{ color: pct === 100 ? "#10B981" : "#94A3B8" }}>
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar pct={pct} />
                  {prog.lastActivity && (
                    <p className="text-[10px]" style={{ color: "#374151" }}>
                      Last: {format(new Date(prog.lastActivity), "MMM d")}
                    </p>
                  )}
                </div>

                {/* Status */}
                {isCert ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}>
                    Completed
                  </span>
                ) : prog.completedCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>
                    In progress
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "rgba(107,114,128,0.08)", color: "#6B7280" }}>
                    Not started
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
