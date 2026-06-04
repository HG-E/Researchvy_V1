import type {
  Course, CourseWithModules, Enrollment,
  LessonListItem, LessonProgress, ProgressMap, CourseStats,
} from "@/types/academy";

// ── Public queries (admin client — bypasses RLS for server-side reads) ────────

export async function getCourses(opts?: { level?: number }): Promise<Course[]> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    let q = admin
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("level")
      .order("position");
    if (opts?.level) q = q.eq("level", opts.level);
    const { data } = await q;
    return (data as Course[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<CourseWithModules | null> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("courses")
      .select(`
        *,
        modules (
          id, course_id, title, description, position, created_at,
          lessons (
            id, title, slug, lesson_type, duration_seconds,
            position, is_free_preview, is_published, module_id
          )
        )
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (!data) return null;
    const course = data as CourseWithModules & {
      modules: Array<{ lessons: unknown[] } & Record<string, unknown>>;
    };
    course.modules.sort((a, b) => (a.position as number) - (b.position as number));
    course.modules.forEach((m) => {
      (m.lessons as Array<{ position: number }>).sort((a, b) => a.position - b.position);
    });
    return course as CourseWithModules;
  } catch {
    return null;
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .eq("is_published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

// ── User-scoped queries (server client — respects auth) ───────────────────────

export async function getUserEnrollment(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    return (data as Enrollment) ?? null;
  } catch {
    return null;
  }
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("enrollments")
      .select("*")
      .eq("user_id", userId);
    return (data as Enrollment[]) ?? [];
  } catch {
    return [];
  }
}

export async function getLessonProgressForCourse(
  userId: string,
  lessonIds: string[]
): Promise<ProgressMap> {
  if (!lessonIds.length) return {};
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("lesson_progress")
      .select("lesson_id, watch_percent, completed_at, last_watched_seconds")
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);
    const map: ProgressMap = {};
    for (const row of (data as LessonProgress[]) ?? []) {
      map[row.lesson_id] = {
        watch_percent:        row.watch_percent,
        completed_at:         row.completed_at,
        last_watched_seconds: row.last_watched_seconds,
      };
    }
    return map;
  } catch {
    return {};
  }
}

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<Pick<LessonProgress, "watch_percent" | "completed_at" | "last_watched_seconds"> | null> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("lesson_progress")
      .select("watch_percent, completed_at, last_watched_seconds")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    return (data as Pick<LessonProgress, "watch_percent" | "completed_at" | "last_watched_seconds">) ?? null;
  } catch {
    return null;
  }
}

// ── Access guard (used by progress/complete API routes) ───────────────────────

export async function checkLessonAccess(userId: string, lessonId: string): Promise<boolean> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();

    // Step 1: get lesson + its module_id
    const { data: lesson } = await admin
      .from("lessons")
      .select("is_free_preview, module_id")
      .eq("id", lessonId)
      .eq("is_published", true)
      .maybeSingle();

    if (!lesson) return false;
    if (lesson.is_free_preview) return true;

    // Step 2: get module → course_id + is_free
    const { data: mod } = await admin
      .from("modules")
      .select("course_id")
      .eq("id", lesson.module_id)
      .maybeSingle();

    if (!mod) return false;

    const { data: course } = await admin
      .from("courses")
      .select("is_free, level")
      .eq("id", mod.course_id)
      .maybeSingle();

    if (!course) return false;
    // Level 1 is fully free — no paywall between modules
    if (course.is_free || course.level === 1) return true;

    // Step 3: check enrollment
    const { data: enrollment } = await admin
      .from("enrollments")
      .select("expires_at")
      .eq("user_id", userId)
      .eq("course_id", mod.course_id)
      .maybeSingle();

    if (!enrollment) return false;
    return !enrollment.expires_at || new Date(enrollment.expires_at) > new Date();
  } catch {
    return false;
  }
}

// ── Dashboard: enrolled courses with progress ─────────────────────────────────

export interface EnrolledCourseEntry {
  course:     CourseWithModules;
  enrollment: Enrollment;
  stats:      CourseStats;
  progress:   ProgressMap;
  nextLesson: LessonListItem | null;
}

export async function getEnrolledCoursesWithProgress(
  userId: string
): Promise<EnrolledCourseEntry[]> {
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();

    // Enrollments
    const { data: enrollmentsRaw } = await admin
      .from("enrollments")
      .select("*")
      .eq("user_id", userId);

    const enrollments = (enrollmentsRaw as Enrollment[]) ?? [];
    const active = enrollments.filter(isEnrollmentActive);
    if (!active.length) return [];

    const courseIds = active.map((e) => e.course_id);

    // Courses with full module+lesson tree
    const { data: coursesRaw } = await admin
      .from("courses")
      .select(`
        *,
        modules (
          id, course_id, title, description, position, created_at,
          lessons (
            id, title, slug, lesson_type, duration_seconds,
            position, is_free_preview, is_published, module_id
          )
        )
      `)
      .in("id", courseIds)
      .eq("is_published", true)
      .order("level")
      .order("position");

    const courses = (coursesRaw as CourseWithModules[]) ?? [];

    // Sort modules/lessons in-place
    for (const course of courses) {
      course.modules.sort((a, b) => a.position - b.position);
      course.modules.forEach((m) => {
        (m.lessons as LessonListItem[]).sort((a, b) => a.position - b.position);
      });
    }

    // All lesson IDs for a single progress query
    const allLessonIds = courses.flatMap((c) =>
      c.modules.flatMap((m) =>
        (m.lessons as LessonListItem[]).filter((l) => l.is_published).map((l) => l.id)
      )
    );

    const progress = allLessonIds.length
      ? await getLessonProgressForCourse(userId, allLessonIds)
      : ({} as ProgressMap);

    return courses.map((course) => {
      const enrollment = active.find((e) => e.course_id === course.id)!;
      const stats      = getCourseStats(course, progress);
      const allLessons = course.modules.flatMap((m) =>
        (m.lessons as LessonListItem[]).filter((l) => l.is_published)
      );
      const nextLesson =
        allLessons.find((l) => !progress[l.id]?.completed_at) ?? allLessons[0] ?? null;
      return { course, enrollment, stats, progress, nextLesson };
    });
  } catch {
    return [];
  }
}

// ── Enrollment counts (social proof for course catalog) ───────────────────────

export async function getCourseEnrollmentCounts(
  courseIds: string[]
): Promise<Record<string, number>> {
  if (!courseIds.length) return {};
  try {
    const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
    const admin = createSupabaseAdminClient();
    // Count active enrollments per course (no expiry or future expiry)
    const { data } = await admin
      .from("enrollments")
      .select("course_id")
      .in("course_id", courseIds)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());
    const counts: Record<string, number> = {};
    for (const row of (data as { course_id: string }[]) ?? []) {
      counts[row.course_id] = (counts[row.course_id] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isEnrollmentActive(enrollment: Enrollment | null): boolean {
  if (!enrollment) return false;
  if (!enrollment.expires_at) return true;
  return new Date(enrollment.expires_at) > new Date();
}

export function getCourseStats(course: CourseWithModules, progress: ProgressMap): CourseStats {
  const allLessons = course.modules.flatMap((m) =>
    (m.lessons as LessonListItem[]).filter((l) => l.is_published)
  );
  const total     = allLessons.length;
  const completed = allLessons.filter((l) => progress[l.id]?.completed_at).length;
  return {
    total_lessons:     total,
    completed_lessons: completed,
    percent_complete:  total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}
