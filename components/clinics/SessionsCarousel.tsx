"use client";

import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { digitalVisibilityClinic } from "@/constants/clinics";

const SESSION_COLORS = [
  "#2563EB", // Session 1
  "#4F46E5", // Session 2
  "#8B5CF6", // Session 3
  "#10B981", // Session 4
];

export function SessionsCarousel() {
  const sessions = digitalVisibilityClinic.sessions;

  return (
    <>
      {/* Desktop (lg+): static vertical list — unchanged */}
      <div className="hidden lg:block space-y-3">
        {sessions.map((session) => (
          <div
            key={session.number}
            className="flex items-start gap-4 rounded-xl p-4"
            style={{ backgroundColor: "#1E293B" }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "#2563EB", color: "#fff" }}
            >
              {session.number}
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                {session.title}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6B7280" }}>
                {session.description.split(".")[0]}.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile (< lg): auto-playing swipe carousel */}
      <MobileCarousel
        className="lg:hidden"
        autoPlay
        autoPlayDelay={4500}
        dotColor="#2563EB"
        items={sessions.map((session, i) => {
          const color = SESSION_COLORS[i] ?? "#10B981";
          return (
            <div
              key={session.number}
              className="mx-0.5 rounded-2xl border overflow-hidden"
              style={{ borderColor: `${color}40` }}
            >
              {/* Gradient accent bar */}
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${color}, #10B981)` }}
              />
              <div className="p-5" style={{ backgroundColor: "#1E293B" }}>
                {/* Step counter */}
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#4B5563" }}
                >
                  Session {session.number} of {sessions.length}
                </p>
                {/* Number + title */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${color}20`,
                      color,
                      border: `1.5px solid ${color}60`,
                    }}
                  >
                    {session.number}
                  </span>
                  <p
                    className="text-base font-bold leading-snug"
                    style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                  >
                    {session.title}
                  </p>
                </div>
                {/* Description */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
                  {session.description}
                </p>
                {/* Topics */}
                <ul className="space-y-1.5">
                  {session.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "#6B7280" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      />
    </>
  );
}
