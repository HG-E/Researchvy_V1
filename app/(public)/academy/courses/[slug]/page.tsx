import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Lock, MessageCircle, PlayCircle, BookOpen, FileText, ChevronDown } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  getCourseBySlug, getUserEnrollment, getLessonProgressForCourse,
  isEnrollmentActive, getCourseStats, formatDuration,
} from "@/lib/academy/courses";
import { getServerUser } from "@/lib/auth/supabase";
import { buildWhatsAppUrl } from "@/config/site";
import { LEVEL_COLORS } from "@/constants/academy";
import { academyCourseSchema } from "@/lib/seo/schemas";
import type { LessonListItem, ModuleWithLessons, ProgressMap } from "@/types/academy";

// Revalidate course detail every hour — content changes infrequently
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return generatePageMetadata({
    title: course.title,
    description: course.description ?? course.subtitle ?? undefined,
    path: `/academy/courses/${slug}`,
  });
}

const LESSON_TYPE_ICON = {
  video:      PlayCircle,
  article:    FileText,
  quiz:       CheckCircle,
  assignment: BookOpen,
};

function LessonRow({
  lesson,
  courseSlug,
  isLocked,
  progress,
}: {
  lesson: LessonListItem;
  courseSlug: string;
  isLocked: boolean;
  progress?: { completed_at: string | null; watch_percent: number };
}) {
  const Icon      = LESSON_TYPE_ICON[lesson.lesson_type];
  const completed = !!progress?.completed_at;
  const started   = (progress?.watch_percent ?? 0) > 0;

  if (isLocked) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-60"
        style={{ backgroundColor: "#080E1A" }}
      >
        <Lock className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
        <span className="text-sm flex-1 truncate" style={{ color: "#6B7280" }}>
          {lesson.title}
        </span>
        {lesson.duration_seconds > 0 && (
          <span className="text-xs flex-shrink-0" style={{ color: "#374151" }}>
            {formatDuration(lesson.duration_seconds)}
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/academy/courses/${courseSlug}/lessons/${lesson.id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[#1E293B]"
      style={{ backgroundColor: "#080E1A" }}
    >
      {completed ? (
        <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
      ) : (
        <Icon
          className="h-4 w-4 flex-shrink-0"
          style={{ color: started ? "#60A5FA" : "#4B5563" }}
        />
      )}
      <span
        className="text-sm flex-1 truncate"
        style={{ color: completed ? "#6B7280" : "#D1D5DB" }}
      >
        {lesson.title}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {lesson.is_free_preview && !isLocked && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#60A5FA" }}>
            Preview
          </span>
        )}
        {lesson.duration_seconds > 0 && (
          <span className="text-xs" style={{ color: "#4B5563" }}>
            {formatDuration(lesson.duration_seconds)}
          </span>
        )}
      </div>
    </Link>
  );
}

function ModuleAccordion({
  mod,
  courseSlug,
  enrolled,
  progress,
}: {
  mod: ModuleWithLessons;
  courseSlug: string;
  enrolled: boolean;
  progress: ProgressMap;
}) {
  const publishedLessons = mod.lessons.filter((l) => l.is_published);
  const completed = publishedLessons.filter((l) => progress[l.id]?.completed_at).length;
  const totalDuration = publishedLessons.reduce((sum, l) => sum + l.duration_seconds, 0);

  return (
    <details
      open
      className="group rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      {/* Module header — acts as the toggle */}
      <summary
        className="flex items-center justify-between gap-4 px-5 py-4 border-b cursor-pointer list-none select-none"
        style={{ borderColor: "#1E293B" }}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{mod.title}</h3>
          {mod.description && (
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{mod.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs flex-shrink-0" style={{ color: "#4B5563" }}>
          {enrolled && (
            <span>{completed}/{publishedLessons.length} done</span>
          )}
          {totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(totalDuration)}
            </span>
          )}
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </div>
      </summary>

      {/* Lessons */}
      <div className="p-3 space-y-1">
        {publishedLessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            courseSlug={courseSlug}
            isLocked={!enrolled && !lesson.is_free_preview}
            progress={progress[lesson.id]}
          />
        ))}
      </div>
    </details>
  );
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [course, user] = await Promise.all([
    getCourseBySlug(slug),
    getServerUser(),
  ]);
  if (!course) notFound();

  const color  = LEVEL_COLORS[(course.level - 1) as 0 | 1 | 2 | 3 | 4];
  const allLessons     = course.modules.flatMap((m) => m.lessons.filter((l) => l.is_published));
  const freeLessons    = allLessons.filter((l) => l.is_free_preview);
  const allLessonIds   = allLessons.map((l) => l.id);
  const totalDuration  = allLessons.reduce((sum, l) => sum + l.duration_seconds, 0);

  const [enrollment, progress] = await Promise.all([
    user ? getUserEnrollment(user.id, course.id) : Promise.resolve(null),
    user && allLessonIds.length
      ? getLessonProgressForCourse(user.id, allLessonIds)
      : Promise.resolve({} as ProgressMap),
  ]);

  const enrolled = isEnrollmentActive(enrollment);
  const stats    = enrolled ? getCourseStats(course, progress) : null;

  const firstLesson = allLessons[0];
  const nextLesson  = enrolled
    ? (allLessons.find((l) => !progress[l.id]?.completed_at) ?? firstLesson)
    : freeLessons[0] ?? null;

  const jsonLd = academyCourseSchema({
    title:           course.title,
    description:     course.description ?? course.subtitle ?? null,
    slug,
    level:           course.level,
    durationMinutes: Math.round(totalDuration / 60),
    lessonCount:     allLessons.length,
    isFree:          course.is_free,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link
          href="/academy/courses"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors text-[#4B5563] hover:text-[#9CA3AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Courses
        </Link>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
            >
              Level {course.level}
            </span>
            {enrolled && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
              >
                Enrolled
              </span>
            )}
            {course.is_free && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
              >
                Free
              </span>
            )}
            {!enrolled && freeLessons.length > 0 && (
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
              >
                {freeLessons.length} free preview{freeLessons.length !== 1 ? "s" : ""} inside
              </span>
            )}
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="text-lg mb-4" style={{ color: "#6B7280" }}>{course.subtitle}</p>
          )}
          {course.description && (
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#4B5563" }}>{course.description}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-5 text-xs" style={{ color: "#6B7280" }}>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {course.modules.length} module{course.modules.length !== 1 ? "s" : ""} · {allLessons.length} lesson{allLessons.length !== 1 ? "s" : ""}
            </span>
            {totalDuration > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(totalDuration)} total
              </span>
            )}
            {!enrolled && freeLessons.length > 0 && (
              <span className="flex items-center gap-1.5" style={{ color: "#FCD34D" }}>
                ✦ Start free — no payment required
              </span>
            )}
          </div>

          {/* Progress bar (enrolled only) */}
          {enrolled && stats && (
            <div className="mt-5 max-w-sm">
              <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "#6B7280" }}>
                <span>{stats.completed_lessons} of {stats.total_lessons} complete</span>
                <span style={{ color }}>{stats.percent_complete}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${stats.percent_complete}%`, backgroundColor: color }}
                />
              </div>
              {stats.percent_complete < 100 && stats.total_lessons > 0 && (
                <p className="text-xs mt-1.5" style={{ color: "#4B5563" }}>
                  {stats.total_lessons - stats.completed_lessons} lesson{stats.total_lessons - stats.completed_lessons !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 mt-6">
            {enrolled ? (
              nextLesson && (
                <Link
                  href={`/academy/courses/${slug}/lessons/${nextLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  <PlayCircle className="h-4 w-4" />
                  {stats?.completed_lessons === 0 ? "Start Course" : "Continue Learning"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )
            ) : (
              <>
                {nextLesson && (
                  <Link
                    href={`/academy/courses/${slug}/lessons/${nextLesson.id}`}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    <PlayCircle className="h-4 w-4" />
                    {course.is_free ? "Start Free Now" : "Try a Free Lesson"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {!course.is_free && (
                  <a
                    href={buildWhatsAppUrl(`Hi, I want to enroll in ${course.title} on Researchvy Academy`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enroll via WhatsApp
                  </a>
                )}
              </>
            )}
          </div>

          {/* Enroll nudge for non-enrolled with free previews exhausted — compact reminder */}
          {!enrolled && !course.is_free && (
            <p className="mt-3 text-xs" style={{ color: "#4B5563" }}>
              Full access · Completion certificate · Enroll in under 2 minutes via WhatsApp
            </p>
          )}
        </div>

        {/* What you'll learn — module overview for non-enrolled visitors */}
        {!enrolled && course.modules.length > 0 && (
          <div
            className="rounded-2xl border p-6 mb-10"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <h2 className="text-sm font-bold mb-4" style={{ color: "#F9FAFB" }}>What you&apos;ll cover</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.modules.map((mod) => (
                <div key={mod.id} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: color }} />
                  <span className="text-sm leading-snug" style={{ color: "#9CA3AF" }}>{mod.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum */}
        <div>
          <h2 className="text-lg font-bold mb-5" style={{ color: "#F9FAFB" }}>
            Course Curriculum
          </h2>
          <div className="space-y-3">
            {course.modules.map((mod) => (
              <ModuleAccordion
                key={mod.id}
                mod={mod}
                courseSlug={slug}
                enrolled={enrolled}
                progress={progress}
              />
            ))}
          </div>

          {/* Bottom enroll CTA for non-enrolled */}
          {!enrolled && !course.is_free && (
            <div
              className="mt-8 rounded-2xl border p-6 text-center"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderTop: `3px solid ${color}` }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFB" }}>
                Ready to get found?
              </p>
              <p className="text-xs mb-5" style={{ color: "#6B7280" }}>
                Enroll in {course.title} and start building real scholarly visibility — certificate included.
              </p>
              <a
                href={buildWhatsAppUrl(`Hi, I want to enroll in ${course.title} on Researchvy Academy`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Enroll via WhatsApp — 2 minutes
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
