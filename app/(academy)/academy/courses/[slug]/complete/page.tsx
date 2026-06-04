import { notFound, redirect } from "next/navigation";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import {
  getCourseBySlug, getUserEnrollment, getLessonProgressForCourse,
  isEnrollmentActive, getCourses,
} from "@/lib/academy/courses";
import { levelColor } from "@/constants/academy";
import { CourseCompleteView } from "@/components/academy/CourseCompleteView";
import type { LessonListItem } from "@/types/academy";

export default async function CourseCompletePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [course, user] = await Promise.all([
    getCourseBySlug(slug),
    getServerUser(),
  ]);

  if (!course) notFound();
  if (!user) redirect(`/signin?next=/academy/courses/${slug}/complete`);

  const enrollment = await getUserEnrollment(user.id, course.id);
  if (!isEnrollmentActive(enrollment)) {
    redirect(`/academy/courses/${slug}`);
  }

  // Verify course is actually complete — all published lessons done
  const allLessons = course.modules.flatMap((m) =>
    (m.lessons as LessonListItem[]).filter((l) => l.is_published)
  );
  const progress = await getLessonProgressForCourse(user.id, allLessons.map((l) => l.id));
  const allDone  = allLessons.every((l) => !!progress[l.id]?.completed_at);

  if (!allDone) {
    // Not finished yet — send them back to continue
    const nextLesson = allLessons.find((l) => !progress[l.id]?.completed_at);
    if (nextLesson) {
      redirect(`/academy/courses/${slug}/lessons/${nextLesson.id}`);
    }
    redirect(`/academy/courses/${slug}`);
  }

  // Researcher display name
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const researcherName = (profile?.full_name as string | null) || user.email?.split("@")[0] || "Researcher";

  // Certificate metadata
  const completedAt  = enrollment!.completed_at ?? new Date().toISOString();
  const certId       = `RVY-${enrollment!.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const completedDate = new Date(completedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Next level course recommendation
  const nextLevelCourses = course.level < 5
    ? await getCourses({ level: course.level + 1 })
    : [];
  const nextCourse = nextLevelCourses[0]
    ? { title: nextLevelCourses[0].title, slug: nextLevelCourses[0].slug, level: nextLevelCourses[0].level }
    : null;

  return (
    <CourseCompleteView
      researcherName={researcherName}
      courseName={course.title}
      courseSlug={slug}
      courseLevel={course.level}
      levelColor={levelColor(course.level)}
      certId={certId}
      completedDate={completedDate}
      completedAt={completedAt}
      lessonsCount={allLessons.length}
      nextCourse={nextCourse}
    />
  );
}
