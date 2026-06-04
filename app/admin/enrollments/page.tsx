import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { GraduationCap, AlertCircle, TrendingUp, Users, Award } from "lucide-react";
import { EnrollmentForm } from "@/components/admin/EnrollmentForm";
import { EnrollmentsTable } from "@/components/admin/EnrollmentsTable";
import type { Course } from "@/types/academy";
import type { EnrollmentRow } from "@/components/admin/EnrollmentsTable";

export const dynamic = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Enrollments — Admin" });

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
      .order("enrolled_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const userIds = [...new Set((enrollments ?? []).map((e: { user_id: string }) => e.user_id))];

    const [{ data: profiles }, { data: authData }] = await Promise.all([
      admin.from("users").select("id, full_name").in("id", userIds),
      userIds.length > 0
        ? admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        : Promise.resolve({ data: { users: [] } }),
    ]);

    const emailMap: Record<string, string> = {};
    for (const u of (authData as { users: { id: string; email?: string }[] } | null)?.users ?? []) {
      emailMap[u.id] = u.email ?? "";
    }
    const nameMap: Record<string, string> = {};
    for (const p of profiles ?? []) {
      nameMap[(p as { id: string; full_name: string }).id] = (p as { id: string; full_name: string }).full_name ?? "";
    }

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

  const now       = new Date();
  const active    = rows.filter((r) => !r.expires_at || new Date(r.expires_at) > now);
  const completed = rows.filter((r) => r.completed_at);
  const thisMonth = rows.filter((r) => {
    const d = new Date(r.enrolled_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

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
            Could not load enrollments. Ensure <code className="text-xs px-1 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>SUPABASE_SERVICE_ROLE_KEY</code> is set in your environment.
          </p>
        </div>
      )}

      {/* KPI strip */}
      {!error && rows.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users,     label: "Active Learners",    value: active.length,    color: "#60A5FA" },
            { icon: Award,     label: "Completions",        value: completed.length, color: "#10B981" },
            { icon: TrendingUp,label: "Enrolled This Month",value: thisMonth.length, color: "#A78BFA" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl border px-5 py-4"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3.5 w-3.5" style={{ color }} />
                <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create enrollment form */}
      {!error && coursesForForm.length > 0 && (
        <div className="mb-6">
          <EnrollmentForm courses={coursesForForm} />
        </div>
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

      {/* Filterable table */}
      {!error && rows.length > 0 && (
        <EnrollmentsTable rows={rows} courseOptions={coursesForForm} />
      )}
    </div>
  );
}
