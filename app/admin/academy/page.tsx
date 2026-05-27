import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, Pencil, BarChart2 } from "lucide-react";
import { NewCourseForm } from "@/components/admin/academy/NewCourseForm";

export const dynamic = "force-dynamic";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
  5: "Master",
};

type CourseRow = {
  id: string; title: string; subtitle: string | null; slug: string;
  level: number; is_free: boolean; is_published: boolean; position: number;
  modules: { id: string; lessons: { id: string }[] }[];
};

export default async function AdminAcademyPage() {
  const user = await getServerUser();
  if (!user) redirect("/auth/signin?next=/admin/academy");
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) redirect("/");

  const admin = createSupabaseAdminClient();
  const { data: courses } = await admin
    .from("courses")
    .select("id, title, subtitle, slug, level, is_free, is_published, position, modules(id, lessons(id))")
    .order("level")
    .order("position");

  const typedCourses = (courses ?? []) as CourseRow[];
  const courseIds = typedCourses.map(c => c.id);

  const enrollmentCounts: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: enr } = await admin
      .from("enrollments")
      .select("course_id")
      .in("course_id", courseIds)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
    for (const row of enr ?? []) {
      enrollmentCounts[row.course_id] = (enrollmentCounts[row.course_id] ?? 0) + 1;
    }
  }

  const grouped: Record<number, CourseRow[]> = {};
  for (const c of typedCourses) {
    if (!grouped[c.level]) grouped[c.level] = [];
    grouped[c.level].push(c);
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Admin › Academy
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Academy
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {typedCourses.length} course{typedCourses.length !== 1 ? "s" : ""} · manage content and curriculum
          </p>
        </div>
        <NewCourseForm />
      </div>

      {typedCourses.length === 0 && (
        <div className="text-center py-20 rounded-xl border" style={{ borderColor: "#1E293B" }}>
          <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color: "#6B7280" }} />
          <p className="text-sm" style={{ color: "#6B7280" }}>No courses yet. Create your first course to get started.</p>
        </div>
      )}

      {([1, 2, 3, 4, 5] as const).map(level => {
        const levelCourses = grouped[level];
        if (!levelCourses?.length) return null;
        return (
          <section key={level}>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4B5563" }}>
              Level {level} — {LEVEL_LABELS[level]}
            </h2>
            <div className="space-y-2">
              {levelCourses.map(course => {
                const moduleCount = course.modules?.length ?? 0;
                const lessonCount = course.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0;
                const enrolled = enrollmentCounts[course.id] ?? 0;
                return (
                  <div key={course.id}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl border"
                    style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>
                          {course.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{
                          backgroundColor: course.is_published ? "#14532d" : "#1E293B",
                          color: course.is_published ? "#86efac" : "#6B7280",
                        }}>
                          {course.is_published ? "live" : "draft"}
                        </span>
                        {course.is_free && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: "#1d4ed8", color: "#bfdbfe" }}>
                            free
                          </span>
                        )}
                      </div>
                      {course.subtitle && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#6B7280" }}>{course.subtitle}</p>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-5 text-xs flex-shrink-0" style={{ color: "#6B7280" }}>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {moduleCount} mod · {lessonCount} lessons
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {enrolled} enrolled
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {enrolled > 0 && (
                        <Link href={`/admin/academy/courses/${course.id}/progress`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}>
                          <BarChart2 className="h-3.5 w-3.5" /> Students
                        </Link>
                      )}
                      <Link href={`/admin/academy/courses/${course.id}`}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
