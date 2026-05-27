"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ChevronDown, PlayCircle, FileText, Lock, X, Menu } from "lucide-react";
import type { CourseWithModules, ProgressMap, LessonListItem } from "@/types/academy";

interface LessonSidebarProps {
  course:          CourseWithModules;
  currentLessonId: string;
  courseSlug:      string;
  enrolled:        boolean;
  progress:        ProgressMap;
}

function lessonIcon(lesson: LessonListItem, completed: boolean, locked: boolean) {
  if (locked)     return <Lock       className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#374151" }} />;
  if (completed)  return <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />;
  if (lesson.lesson_type === "article") return <FileText className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />;
  return <PlayCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />;
}

export function LessonSidebar({ course, currentLessonId, courseSlug, enrolled, progress }: LessonSidebarProps) {
  const [open, setOpen]       = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Scroll the active lesson into the visible area of the sidebar on mount
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentLessonId]);

  function toggleModule(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const allPublished  = course.modules.flatMap((m) => m.lessons.filter((l) => l.is_published));
  const completedCount = enrolled ? allPublished.filter((l) => progress[l.id]?.completed_at).length : 0;
  const pct            = allPublished.length > 0 && enrolled
    ? Math.round((completedCount / allPublished.length) * 100)
    : 0;

  const inner = (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0A0F1A" }}>
      {/* Course title + progress */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "#1E293B" }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            href={`/academy/courses/${courseSlug}`}
            className="text-xs font-bold leading-snug hover:text-white transition-colors line-clamp-2"
            style={{ color: "#D1D5DB" }}
          >
            {course.title}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden flex-shrink-0 p-1 rounded"
            style={{ color: "#4B5563" }}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {enrolled && allPublished.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: "#4B5563" }}>
              <span>{completedCount}/{allPublished.length} lessons</span>
              <span style={{ color: pct === 100 ? "#10B981" : "#2563EB" }}>{pct}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#10B981" : "#2563EB" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Module + lesson list */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Course lessons">
        {course.modules.map((mod) => {
          const publishedLessons = mod.lessons.filter((l) => l.is_published);
          const isCollapsed = collapsed[mod.id] ?? false;
          const completedCount = publishedLessons.filter((l) => progress[l.id]?.completed_at).length;

          return (
            <div key={mod.id}>
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[#1E293B]"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-snug truncate" style={{ color: "#F9FAFB" }}>
                    {mod.title}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5563" }}>
                    {completedCount}/{publishedLessons.length} lessons
                  </p>
                </div>
                <ChevronDown
                  className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200"
                  style={{ color: "#4B5563", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                />
              </button>

              {!isCollapsed && (
                <div className="pb-1">
                  {publishedLessons.map((lesson) => {
                    const isCurrent  = lesson.id === currentLessonId;
                    const isLocked   = !enrolled && !lesson.is_free_preview;
                    const completed  = !!progress[lesson.id]?.completed_at;

                    if (isLocked) {
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2.5 px-4 py-2 opacity-50"
                        >
                          {lessonIcon(lesson, completed, true)}
                          <span className="text-xs truncate" style={{ color: "#4B5563" }}>
                            {lesson.title}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        ref={isCurrent ? activeRef : null}
                        href={`/academy/courses/${courseSlug}/lessons/${lesson.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 transition-colors"
                        style={{
                          backgroundColor: isCurrent ? "rgba(37,99,235,0.12)" : "transparent",
                          borderLeft: isCurrent ? "2px solid #2563EB" : "2px solid transparent",
                        }}
                      >
                        {lessonIcon(lesson, completed, false)}
                        <span
                          className="text-xs leading-snug line-clamp-2"
                          style={{ color: isCurrent ? "#F9FAFB" : completed ? "#4B5563" : "#9CA3AF" }}
                        >
                          {lesson.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r"
        style={{ borderColor: "#1E293B", height: "100vh", position: "sticky", top: 0 }}
      >
        {inner}
      </aside>

      {/* Mobile: floating toggle + drawer overlay */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#2563EB" }}
          aria-label="Open course navigation"
        >
          <Menu className="h-4 w-4" />
          Lessons
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(8,14,26,0.7)" }}
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] flex flex-col"
              style={{ borderRight: "1px solid #1E293B" }}
            >
              {inner}
            </div>
          </>
        )}
      </div>
    </>
  );
}
