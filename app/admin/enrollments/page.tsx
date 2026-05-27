import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { format } from "date-fns";
import { GraduationCap, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { EnrollmentForm } from "@/components/admin/EnrollmentForm";
import { EnrollmentActions } from "@/components/admin/EnrollmentActions";
import type { Course } from "@/types/academy";

export const metadata = generatePageMetadata({ title: "Enrollments — Admin" });

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  pro:           { bg: "rgba(139,92,246,0.12)", text: "#A78BFA" },
  institutional: { bg: "rgba(239,68,68,0.12)",  text: "#FCA5A5" },
  builder:       { bg: "rgba(245,158,11,0.12)", text: "#FCD34D" },
  starter:       { bg: "rgba(37,99,235,0.12)",  text: "#60A5FA" },
  complimentary: { bg: "rgba(16,185,129,0.12)", text: "#34D399" },
};

type EnrollmentRow = {
  id:          string;
  user_id:     string;
  user_email:  string;
  user_name:   string;
  course_id:   string;
  tier:        string;
  source:      string;
  enrolled_at: string;
  expires_at:  string | null;
  completed_at: string | null;
  courses: { id: string; title: string; level: number; slug: string } | null;
};

async function getEnrollments(): Promise<{ rows: EnrollmentRow[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();

    const { data: enrollments, error } = await admin
      .from("enrollments")
      .select(`
        id, user_id, course_id, tier, source,
        enrolled_at, expires_at, completed_at,
        courses (id, title, level, slug)
      `)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    const userIds = [...new Set((enrollments ?? []).map((e: { user_id: string }) => e.user_id))];

    const [{ data: profiles }, { data: authData }] = await Promise.all([
      admin.from("users").select("id, full_name").in("id", userIds),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const emailMap: Record<string, string> = {};
    for (const u of authData?.users ?? []) emailMap[u.id] = u.email ?? "";
    const nameMap: Record<string, string> = {};
    for (const p of profiles ?? []) nameMap[(p as { id: string; full_name: string }).id] = (p as { id: string; full_name: string }).full_name ?? "";

    const rows: EnrollmentRow[] = (enrollments ?? []).map((e: Record<string, unknown>) => ({
      ...(e as Omit<EnrollmentRow, "user_email" | "user_name">),
      user_email: emailMap[e.user_id as string] ?? "",
      user_name:  nameMap[e.user_id as string] ?? "",
    }));

    return { rows, error: false };
  } catch (err) {
    console.error("[admin/enrollments]", err);
    return { rows: [], error: true };
  }
}

async function getAllCoursesForAdmin(): Promise<Pick<Course, "id" | "title" | "level">[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("courses")
      .select("id, title, level")
      .order("level")
      .order("position");
    return (data ?? []) as Pick<Course, "id" | "title" | "level">[];
  } catch {
    return [];
  }
}

export default async function EnrollmentsPage() {
  const [{ rows, error }, coursesForForm] = await Promise.all([
    getEnrollments(),
    getAllCoursesForAdmin(),
  ]);

  const active    = rows.filter((r) => !r.expires_at || new Date(r.expires_at) > new Date());
  const completed = rows.filter((r) => r.completed_at);

  function isActive(r: EnrollmentRow) {
    return !r.expires_at || new Date(r.expires_at) > new Date();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Enrollments
        </p>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Enrollments
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          {error
            ? "Could not load enrollments."
            : `${rows.length} total · ${active.length} active · ${completed.length} completed`}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Could not load enrollments. Check your environment configuration.
          </p>
        </div>
      )}

      {/* Create enrollment form */}
      {!error && coursesForForm.length > 0 && (
        <EnrollmentForm courses={coursesForForm} onSuccess={() => {}} />
      )}

      {/* Empty state */}
      {!error && rows.length === 0 && (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <GraduationCap className="h-8 w-8 mx-auto mb-3" style={{ color: "#2563EB" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "#F9FAFB" }}>No enrollments yet</p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Use the form above to manually enroll a researcher in a course.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && rows.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "#1E293B" }}
        >
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
            {rows.map((row, i) => {
              const tierStyle  = TIER_COLORS[row.tier] ?? TIER_COLORS.starter;
              const active     = isActive(row);

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
                    {row.expires_at
                      ? format(new Date(row.expires_at), "MMM d, yyyy")
                      : "—"}
                  </span>

                  {/* Actions */}
                  {active && <EnrollmentActions enrollmentId={row.id} />}
                  {!active && <div />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
