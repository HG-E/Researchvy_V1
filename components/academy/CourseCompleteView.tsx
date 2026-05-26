"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, Share2, BookOpen } from "lucide-react";

const CONFETTI_COLORS = ["#60A5FA", "#A78BFA", "#34D399", "#FCD34D", "#F472B6", "#F87171", "#FBBF24"];
const PIECES = Array.from({ length: 48 }, (_, i) => ({
  id:       i,
  x:        Math.random() * 100,          // vw
  size:     5 + Math.random() * 7,        // px
  color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay:    Math.random() * 0.8,          // s
  duration: 2.4 + Math.random() * 1.6,   // s
  rotate:   Math.random() * 360,
  shape:    i % 3 === 0 ? "circle" : "rect",
}));

function Confetti() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {PIECES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0.8, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            width:  p.size,
            height: p.shape === "circle" ? p.size : p.size * 0.45,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : 2,
          }}
        />
      ))}
    </div>
  );
}

interface CourseCompleteViewProps {
  researcherName: string;
  courseName:     string;
  courseSlug:     string;
  courseLevel:    number;
  levelColor:     string;
  certId:         string;
  completedDate:  string;
  lessonsCount:   number;
  nextCourse: {
    title: string;
    slug:  string;
    level: number;
  } | null;
}

export function CourseCompleteView({
  researcherName,
  courseName,
  courseSlug,
  courseLevel,
  levelColor,
  certId,
  completedDate,
  lessonsCount,
  nextCourse,
}: CourseCompleteViewProps) {
  const [shared, setShared] = useState(false);

  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://researchvy.com";

  const shareUrl    = `${siteUrl}/academy/courses/${courseSlug}`;
  const shareText   = `I just completed "${courseName}" on Researchvy Academy 🎓 Building my research visibility, one lesson at a time. #ResearchVisibility #AcademicDevelopment`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({ title: courseName, text: shareText, url: shareUrl });
      setShared(true);
    } catch { /* user cancelled */ }
  }

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden"
      style={{ backgroundColor: "#080E1A" }}
    >
      <Confetti />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >

          {/* Top label */}
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-8" style={{ color: "#4B5563" }}>
            Researchvy Academy
          </p>

          {/* Certificate card */}
          <div
            className="rounded-3xl border p-10 mb-6 text-center"
            style={{
              backgroundColor: "#0F172A",
              borderColor: "#1E293B",
              borderTop: `3px solid ${levelColor}`,
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 rounded-full blur-xl"
              style={{ backgroundColor: levelColor, opacity: 0.4 }}
            />

            <div className="text-5xl mb-4">🎓</div>

            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
              Certificate of Completion
            </p>
            <p className="text-sm mb-5" style={{ color: "#9CA3AF" }}>This certifies that</p>

            <h1
              className="text-3xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              {researcherName}
            </h1>
            <p className="text-sm mb-5" style={{ color: "#9CA3AF" }}>has successfully completed</p>

            <h2 className="text-xl font-bold mb-4" style={{ color: "#F9FAFB" }}>
              {courseName}
            </h2>

            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${levelColor}18`,
                color: levelColor,
                border: `1px solid ${levelColor}30`,
              }}
            >
              Level {courseLevel}
            </span>

            <div className="border-t mt-6 mb-4" style={{ borderColor: "#1E293B" }} />

            <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "#4B5563" }}>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" style={{ color: "#10B981" }} />
                {lessonsCount} lessons
              </span>
              <span>{completedDate}</span>
            </div>
            <p
              className="text-[10px] mt-2 font-mono tracking-wider"
              style={{ color: "#374151" }}
            >
              {certId}
            </p>
          </div>

          {/* Share row */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0A66C2", color: "#fff" }}
            >
              <Share2 className="h-4 w-4" />
              Share on LinkedIn
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#000", color: "#fff" }}
            >
              <Share2 className="h-4 w-4" />
              Share on X
            </a>
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
                style={{ borderColor: "#1E293B", color: shared ? "#10B981" : "#9CA3AF" }}
              >
                <Share2 className="h-4 w-4" />
                {shared ? "Shared!" : "Share"}
              </button>
            )}
          </div>

          {/* Next step */}
          {nextCourse ? (
            <div
              className="rounded-2xl border p-5 text-center"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#4B5563" }}>
                What&apos;s next
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFB" }}>
                Level {nextCourse.level}: {nextCourse.title}
              </p>
              <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
                Continue building on what you&apos;ve mastered
              </p>
              <Link
                href={`/academy/courses/${nextCourse.slug}`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2563EB" }}
              >
                Start Level {nextCourse.level}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div
              className="rounded-2xl border p-5 text-center"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>
                You&apos;ve reached the top 🏆
              </p>
              <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
                Academy complete. Browse all courses or start over from any level.
              </p>
              <Link
                href="/academy/courses"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#10B981" }}
              >
                <BookOpen className="h-4 w-4" />
                Browse All Courses
              </Link>
            </div>
          )}

          {/* Back link */}
          <p className="text-center mt-6">
            <Link
              href={`/academy/courses/${courseSlug}`}
              className="text-xs transition-colors hover:text-white"
              style={{ color: "#4B5563" }}
            >
              ← Back to course
            </Link>
          </p>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
