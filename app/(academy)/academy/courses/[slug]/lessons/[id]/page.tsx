import { notFound } from "next/navigation";
import Link from "next/link";
import { Lock, MessageCircle, ArrowLeft } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  getCourseBySlug, getLessonById, getUserEnrollment,
  getLessonProgress, isEnrollmentActive, getLessonProgressForCourse,
} from "@/lib/academy/courses";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { buildWhatsAppUrl } from "@/config/site";
import { LessonPlayerClient as LessonPlayer } from "@/components/academy/LessonPlayerClient";
import { LessonSidebar } from "@/components/academy/LessonSidebar";
import { MdxContent } from "@/components/insights/MdxContent";
import type { Lesson } from "@/types/academy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [course, lesson] = await Promise.all([getCourseBySlug(slug), getLessonById(id)]);
  if (!course || !lesson) return {};
  return generatePageMetadata({
    title: `${lesson.title} — ${course.title}`,
    path:  `/academy/courses/${slug}/lessons/${id}`,
  });
}

function AccessGate({ courseSlug, courseName }: { courseSlug: string; courseName: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className="rounded-2xl border p-10 text-center max-w-md"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
        >
          <Lock className="h-6 w-6" style={{ color: "#60A5FA" }} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Enroll to access this lesson
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
          This lesson is part of <strong style={{ color: "#D1D5DB" }}>{courseName}</strong>.
          Reach out via WhatsApp to enroll and unlock all lessons.
        </p>

        {/* What you'll gain — value teaser */}
        <ul className="text-left text-sm space-y-2 mb-6 px-2" style={{ color: "#9CA3AF" }}>
          {[
            "Full access to every lesson in this course",
            "Track your progress and mark lessons complete",
            "Downloadable workbooks and templates",
          ].map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#60A5FA" }} />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <a
            href={buildWhatsAppUrl(`Researchvy Academy — enroll in ${courseName}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="h-4 w-4" />
            Enroll via WhatsApp
          </a>
          <Link
            href={`/academy/courses/${courseSlug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium border transition-colors hover:bg-[#1E293B]"
            style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const [course, lesson, user] = await Promise.all([
    getCourseBySlug(slug),
    getLessonById(id) as Promise<Lesson | null>,
    getServerUser(),
  ]);

  if (!course || !lesson) notFound();

  // Verify this lesson belongs to this course
  const moduleIds = course.modules.map((m) => m.id);
  if (!moduleIds.includes(lesson.module_id)) notFound();

  // Auth check
  const enrollment = user ? await getUserEnrollment(user.id, course.id) : null;
  const enrolled   = isEnrollmentActive(enrollment);
  // Level 1 courses are fully free — no paywall between modules
  const canAccess  = enrolled || lesson.is_free_preview || course.is_free || course.level === 1;

  // Build flat ordered lesson list for prev/next navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.filter((l) => l.is_published)
  );
  const currentIdx = allLessons.findIndex((l) => l.id === id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Load progress + lesson note
  const allLessonIds = allLessons.map((l) => l.id);
  const admin = createSupabaseAdminClient();
  const [lessonProg, progressMap, noteRow] = await Promise.all([
    user && canAccess ? getLessonProgress(user.id, id) : Promise.resolve(null),
    user && enrolled  ? getLessonProgressForCourse(user.id, allLessonIds) : Promise.resolve({}),
    user && enrolled  ? admin.from("lesson_notes").select("content").eq("user_id", user.id).eq("lesson_id", id).maybeSingle() : Promise.resolve(null),
  ]);
  const initialNote = (noteRow as { data?: { content?: string } | null } | null)?.data?.content ?? "";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <LessonSidebar
        course={course}
        currentLessonId={id}
        courseSlug={slug}
        enrolled={enrolled}
        progress={progressMap}
      />

      {canAccess ? (
        <LessonPlayer
          lesson={lesson}
          courseSlug={slug}
          courseName={course.title}
          prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
          nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
          initialDone={!!lessonProg?.completed_at}
          initialSeconds={lessonProg?.last_watched_seconds ?? 0}
          enrolled={enrolled}
          initialNote={initialNote}
          contentNode={lesson.content_md ? <MdxContent source={lesson.content_md} /> : null}
        />
      ) : (
        <AccessGate courseSlug={slug} courseName={course.title} />
      )}
    </div>
  );
}
