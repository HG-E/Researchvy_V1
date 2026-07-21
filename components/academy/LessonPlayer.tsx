"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2, PlayCircle } from "lucide-react";
import { YouTubePlayer } from "@/components/academy/YouTubePlayer";
import { LessonNotes } from "@/components/academy/LessonNotes";
import { posthog } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";
import type { Lesson } from "@/types/academy";

interface AdjacentLesson {
  id:    string;
  title: string;
}

interface LessonPlayerProps {
  lesson:         Lesson;
  courseSlug:     string;
  courseName:     string;
  prevLesson:     AdjacentLesson | null;
  nextLesson:     AdjacentLesson | null;
  initialDone:    boolean;
  initialSeconds: number;
  enrolled:       boolean;
  initialNote:    string;
  contentNode:    ReactNode;
  downloadButton?: ReactNode;
}

function getNonYouTubeEmbedUrl(lesson: Lesson): string | null {
  if (lesson.video_provider === "youtube") return null; // handled by YouTubePlayer
  if (lesson.video_url) return lesson.video_url;
  return null;
}

const LS_KEY = (id: string) => `lesson_progress_${id}`;

export function LessonPlayer({ lesson, courseSlug, courseName, prevLesson, nextLesson, initialDone, initialSeconds, enrolled, initialNote, contentNode, downloadButton }: LessonPlayerProps) {
  const router = useRouter();
  const [done, setDone]             = useState(initialDone);
  const [loading, setLoading]       = useState(false);
  const [announced, setAnnounced]   = useState("");
  const announcerRef = useRef<HTMLDivElement>(null);

  // Resolve starting position: prefer localStorage over server value so
  // a page refresh mid-video resumes where the user left off
  const resolvedSeconds = (() => {
    try {
      const saved = localStorage.getItem(LS_KEY(lesson.id));
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n > initialSeconds) return n;
      }
    } catch { /* localStorage unavailable (SSR / private mode) */ }
    return initialSeconds;
  })();

  // Save progress to localStorage every 10 s via a custom event the
  // video player fires (YouTubePlayer already emits onProgress)
  useEffect(() => {
    function handleProgress(e: Event) {
      const sec = (e as CustomEvent<number>).detail;
      try { localStorage.setItem(LS_KEY(lesson.id), String(sec)); } catch { /* ignore */ }
    }
    window.addEventListener("lesson:progress", handleProgress);
    return () => window.removeEventListener("lesson:progress", handleProgress);
  }, [lesson.id]);

  // Clear localStorage once the lesson is marked complete
  useEffect(() => {
    if (done) {
      try { localStorage.removeItem(LS_KEY(lesson.id)); } catch { /* ignore */ }
    }
  }, [done, lesson.id]);

  // Track lesson start once per mount
  useEffect(() => {
    posthog.capture("lesson_started", {
      lesson_id:   lesson.id,
      lesson_type: lesson.lesson_type,
      course_slug: courseSlug,
    });
  }, [lesson.id, lesson.lesson_type, courseSlug]);

  // Clear sr announcement
  useEffect(() => {
    if (!announced) return;
    const t = setTimeout(() => setAnnounced(""), 3000);
    return () => clearTimeout(t);
  }, [announced]);

  async function markComplete() {
    if (done || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/academy/complete", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lesson_id: lesson.id }),
      });
      if (!res.ok) return;

      setDone(true);
      setAnnounced("Lesson marked as complete.");

      posthog.capture("lesson_completed", {
        lesson_id:   lesson.id,
        lesson_type: lesson.lesson_type,
        course_slug: courseSlug,
      });

      // If this was the last lesson, check course completion
      if (!nextLesson) {
        const checkRes = await fetch("/api/academy/course-complete", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ course_slug: courseSlug }),
        });
        if (checkRes.ok) {
          const { complete } = await checkRes.json();
          if (complete) {
            posthog.capture("course_completed", { course_slug: courseSlug });
            // Brief pause so the "Lesson complete" state renders, then celebrate
            setTimeout(() => {
              router.replace(`/academy/courses/${courseSlug}/complete`);
            }, 800);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const nonYtEmbedUrl = getNonYouTubeEmbedUrl(lesson);
  const isYouTube     = lesson.video_provider === "youtube" && !!lesson.video_id;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Screen-reader live region */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announced}
      </div>

      {/* YouTube embed — IFrame API with resume + heartbeat progress tracking */}
      {isYouTube && (
        <YouTubePlayer
          videoId={lesson.video_id!}
          title={lesson.title}
          lessonId={lesson.id}
          initialSeconds={resolvedSeconds}
          onVideoEnd={enrolled ? markComplete : undefined}
        />
      )}

      {/* Non-YouTube video embed (Bunny, external URL) */}
      {!isYouTube && nonYtEmbedUrl && (
        <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={nonYtEmbedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">

          <div className="mb-6">
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              {lesson.title}
            </h1>
          </div>

          {/* Mark complete button — enrolled users only */}
          {enrolled && (
            <div className="mb-8">
              {done ? (
                <div
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(16,185,129,0.12)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }}
                  role="status"
                >
                  <CheckCircle className="h-4 w-4" />
                  Lesson complete
                </div>
              ) : (
                <button
                  onClick={markComplete}
                  disabled={loading}
                  aria-label="Mark this lesson as complete"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60 hover:bg-[#F1F5F9] min-h-[44px] active:opacity-70"
                  style={{ backgroundColor: "#161D2E", color: "#374151", border: "1px solid #334155" }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" style={{ color: "#4B5563" }} />
                  )}
                  Mark as complete
                </button>
              )}
            </div>
          )}

          {/* Enroll nudge — shown to non-enrolled users after viewing a free preview */}
          {!enrolled && lesson.is_free_preview && (
            <div
              className="mb-8 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderLeft: "3px solid #2563EB" }}
            >
              <div className="px-6 py-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                  You just saw what&apos;s possible
                </p>
                <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: "#111827" }}>
                  Ready to unlock the full course?
                </h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: "#4B5563" }}>
                  <strong style={{ color: "#374151" }}>{courseName}</strong> includes all lessons,
                  a completion certificate, and a direct path to global scholarly visibility.
                  Enroll via WhatsApp — it takes under 2 minutes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={buildWhatsAppUrl(`Researchvy Academy — enroll in ${courseName}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    Enroll via WhatsApp
                  </a>
                  <Link
                    href={`/academy/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors hover:bg-[#F1F5F9]"
                    style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
                  >
                    View full curriculum
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Lesson content */}
          {contentNode && (
            <div className="prose-invert mb-10">
              {contentNode}
            </div>
          )}

          {/* Download as PDF — shows below content */}
          {downloadButton && (
            <div className="flex justify-end mb-6 print:hidden">
              {downloadButton}
            </div>
          )}

          {/* Lesson notes — enrolled users only */}
          {enrolled && (
            <LessonNotes lessonId={lesson.id} initialNote={initialNote} />
          )}

          {/* Lesson navigation */}
          <div
            className="flex items-center justify-between gap-4 pt-6 border-t"
            style={{ borderColor: "#E2E8F0" }}
          >
            {prevLesson ? (
              <Link
                href={`/academy/courses/${courseSlug}/lessons/${prevLesson.id}`}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors hover:bg-[#F1F5F9] max-w-[45%]"
                style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
              >
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/academy/courses/${courseSlug}/lessons/${nextLesson.id}`}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 max-w-[45%]"
                style={{ backgroundColor: "#2563EB" }}
              >
                <span className="truncate">{nextLesson.title}</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            ) : enrolled && done ? (
              /* Completion redirect is handled by markComplete; this is the fallback */
              <Link
                href={`/academy/courses/${courseSlug}/complete`}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#10B981" }}
              >
                View your certificate <ArrowRight className="h-4 w-4" />
              </Link>
            ) : enrolled ? (
              <button
                onClick={markComplete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10B981" }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                Complete &amp; Finish Course
              </button>
            ) : (
              <Link
                href={`/academy/courses/${courseSlug}`}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                Enroll to continue <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
