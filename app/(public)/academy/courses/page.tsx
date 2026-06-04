import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Lock, PlayCircle, Users } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getCourses, getUserEnrollments, getCourseEnrollmentCounts, formatDuration } from "@/lib/academy/courses";
import { getServerUser } from "@/lib/auth/supabase";
import { buildWhatsAppUrl } from "@/config/site";
import { MessageCircle } from "lucide-react";
import { LEVEL_COLORS, LEVEL_LABELS } from "@/constants/academy";
import type { Course, Enrollment } from "@/types/academy";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Academy Courses",
  description: "Self-paced courses covering every dimension of scholarly visibility, from foundational concepts to advanced research intelligence.",
  path: "/academy/courses",
});

function CourseCard({
  course,
  enrollment,
  enrolledCount,
}: {
  course: Course;
  enrollment?: Enrollment;
  enrolledCount?: number;
}) {
  const color  = LEVEL_COLORS[(course.level - 1) as 0 | 1 | 2 | 3 | 4];
  const active = enrollment && (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date());

  return (
    <Link
      href={`/academy/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      {/* Thumbnail / placeholder */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "16/9", backgroundColor: "#080E1A" }}
      >
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <BookOpen className="h-6 w-6" style={{ color }} />
            </div>
          </div>
        )}
        {/* Level badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
        >
          Level {course.level}
        </span>
        {/* Enrolled badge */}
        {active && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            Enrolled
          </span>
        )}
        {/* Free badge */}
        {course.is_free && !active && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#60A5FA" }}
          >
            Free
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold mb-1 leading-snug group-hover:text-white transition-colors" style={{ color: "#F9FAFB" }}>
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="text-xs mb-3 leading-relaxed line-clamp-2" style={{ color: "#6B7280" }}>
            {course.subtitle}
          </p>
        )}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t" style={{ borderColor: "#1E293B" }}>
          {course.duration_minutes > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
              <Clock className="h-3 w-3" />
              {formatDuration(course.duration_minutes * 60)}
            </span>
          )}
          {enrolledCount && enrolledCount >= 3 ? (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
              <Users className="h-3 w-3" />
              {enrolledCount}
            </span>
          ) : null}
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold" style={{ color }}>
            {active ? (
              <><PlayCircle className="h-3.5 w-3.5" /> Continue</>
            ) : course.is_free ? (
              <><PlayCircle className="h-3.5 w-3.5" /> Start free</>
            ) : (
              <><Lock className="h-3 w-3" /> Enroll</>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function AcademyCoursesPage() {
  const user = await getServerUser();
  const [courses, enrollments] = await Promise.all([
    getCourses(),
    user ? getUserEnrollments(user.id) : Promise.resolve([]),
  ]);

  const enrollmentMap    = Object.fromEntries(enrollments.map((e) => [e.course_id, e]));
  const enrollmentCounts = await getCourseEnrollmentCounts(courses.map((c) => c.id));

  // Group by level
  const byLevel = [1, 2, 3, 4, 5].map((level) => ({
    level,
    label: LEVEL_LABELS[(level - 1) as 0 | 1 | 2 | 3 | 4],
    color: LEVEL_COLORS[(level - 1) as 0 | 1 | 2 | 3 | 4],
    courses: courses.filter((c) => c.level === level),
  })).filter((g) => g.courses.length > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Academy
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            All Courses
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "#6B7280" }}>
            Self-paced courses across five levels. Work through each level in sequence,
            or jump to the topic most relevant to your current research goals.
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
            <span>✓</span> Level 1 is 100% free — no payment, no signup required to start
          </div>
        </div>

        {courses.length === 0 ? (
          /* Empty state — no published courses yet */
          <div
            className="rounded-2xl border p-12 text-center max-w-xl mx-auto"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <BookOpen className="h-10 w-10 mx-auto mb-4" style={{ color: "#1E3A5F" }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>
              Courses launching soon
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Level 1 courses are live now. Levels 2–5 are in development — you'll get early access when they launch.
              <br /><br />
              <strong style={{ color: "#D1D5DB" }}>Note:</strong> The <a href="/clinics" style={{ color: "#60A5FA" }}>Digital Visibility Clinic</a> is a separate, live, cohort-based paid programme — not part of the Academy. You can do both independently.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/clinics"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                Start with a Clinic <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={buildWhatsAppUrl("Researchvy Academy courses — early access interest")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                <MessageCircle className="h-4 w-4" />
                Register Interest
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {byLevel.map(({ level, label, color, courses: levelCourses }) => (
              <section key={level}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {level}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>
                        Level {level}
                      </p>
                      {level === 1 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}>
                          FREE
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold" style={{ color: "#F9FAFB" }}>{label}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {levelCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrollment={enrollmentMap[course.id]}
                      enrolledCount={enrollmentCounts[course.id] ?? 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
