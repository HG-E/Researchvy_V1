export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  BookOpen, ArrowRight, PlayCircle, CheckCircle2,
  GraduationCap, Star, MessageCircle,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { getEnrolledCoursesWithProgress } from "@/lib/academy/courses";
import { buildWhatsAppUrl } from "@/config/site";
import { levelColor } from "@/constants/academy";

export const metadata = generatePageMetadata({ title: "Academy", noIndex: true });

export default async function AcademyPage() {
  const user = await getServerUser();
  if (!user) return null;

  const entries = await getEnrolledCoursesWithProgress(user.id);

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#8B5CF6" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Academy
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your enrolled courses and learning progress
        </p>
      </div>

      {/* Enrolled courses */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map(({ course, stats, nextLesson }) => {
            const color = levelColor(course.level);
            const isComplete = stats.percent_complete === 100;

            return (
              <div
                key={course.id}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                {/* Color accent bar */}
                <div className="h-1" style={{ backgroundColor: color }} />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
                        >
                          Level {course.level}
                        </span>
                        {isComplete && (
                          <span
                            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </span>
                        )}
                      </div>
                      <h2 className="text-base font-bold leading-snug" style={{ color: "#F9FAFB" }}>
                        {course.title}
                      </h2>
                      {course.subtitle && (
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#6B7280" }}>
                          {course.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Progress stat */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold" style={{ color }}>
                        {stats.percent_complete}%
                      </p>
                      <p className="text-[10px]" style={{ color: "#4B5563" }}>
                        {stats.completed_lessons}/{stats.total_lessons} lessons
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: "#1E293B" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.percent_complete}%`, backgroundColor: color }}
                    />
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {nextLesson && !isComplete && (
                      <Link
                        href={`/academy/courses/${course.slug}/lessons/${nextLesson.id}`}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: color }}
                      >
                        <PlayCircle className="h-4 w-4" />
                        {stats.completed_lessons === 0 ? "Start Course" : "Continue Learning"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    {isComplete && (
                      <Link
                        href={`/academy/courses/${course.slug}/complete`}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        View Certificate
                      </Link>
                    )}
                    <Link
                      href={`/academy/courses/${course.slug}`}
                      className="text-xs transition-colors"
                      style={{ color: "#4B5563" }}
                    >
                      View curriculum →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state — not enrolled in any course */
        <div
          className="rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(139,92,246,0.1)" }}
          >
            <BookOpen className="h-7 w-7" style={{ color: "#8B5CF6" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>
            No courses yet
          </h2>
          <p className="text-sm mb-6 leading-relaxed max-w-sm mx-auto" style={{ color: "#6B7280" }}>
            Browse the Academy catalog and enroll in a course to start building your
            scholarly visibility, step by step.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/academy/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              <GraduationCap className="h-4 w-4" />
              Browse Courses
            </Link>
            <a
              href={buildWhatsAppUrl("Researchvy Academy — course enrolment")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              <MessageCircle className="h-4 w-4" />
              Enroll via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Browse catalog link — always visible when enrolled */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "#4B5563" }}>
            {entries.length} course{entries.length !== 1 ? "s" : ""} enrolled
          </p>
          <Link
            href="/academy/courses"
            className="text-xs font-semibold transition-colors hover:text-white"
            style={{ color: "#6B7280" }}
          >
            Browse all courses →
          </Link>
        </div>
      )}

      {/* Why the Academy */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#9CA3AF" }}>
          <Star className="h-4 w-4" style={{ color: "#F59E0B" }} />
          Why researchers choose the Academy
        </h3>
        <ul className="space-y-3">
          {[
            "Self-paced with structured milestones — fits around your research schedule",
            "Built on the Researchvy 7-Step Framework, validated across 100+ researchers",
            "Lifetime access to all materials, templates, and workbooks",
            "Private cohort community with peer accountability",
            "Direct access to expert advisors for your specific visibility challenges",
          ].map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm" style={{ color: "#6B7280" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#8B5CF6" }} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Academy-only footer — no DVC cross-promotion inside the Academy journey */}
      <div className="rounded-xl border p-4 text-center" style={{ borderColor: "#1E293B" }}>
        <p className="text-xs" style={{ color: "#374151" }}>
          Researchvy Academy · Self-paced · Level 1 free ·{" "}
          <Link href="/academy/courses" style={{ color: "#4B5563", textDecoration: "underline" }}>
            Browse all courses
          </Link>
        </p>
      </div>

    </div>
  );
}
