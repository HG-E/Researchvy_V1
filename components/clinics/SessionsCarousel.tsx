"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { digitalVisibilityClinic } from "@/constants/clinics";

const SESSION_COLORS = [
  "#2563EB",
  "#4F46E5",
  "#8B5CF6",
  "#F59E0B",
  "#D97706",
];

function SessionRow({
  session,
}: {
  session: (typeof digitalVisibilityClinic.sessions)[number];
}) {
  return (
    <div
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
  );
}

function SessionCard({
  session,
  color,
  total,
}: {
  session: (typeof digitalVisibilityClinic.sessions)[number];
  color: string;
  total: number;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${color}40` }}
    >
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, #10B981)` }} />
      <div className="p-5" style={{ backgroundColor: "#1E293B" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
          {(session as { isBonus?: boolean }).isBonus
            ? "Bonus Masterclass"
            : `Module ${session.number} of ${total}`}
        </p>
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
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
          {session.description}
        </p>
        <ul className="space-y-1.5">
          {session.topics.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-xs" style={{ color: "#6B7280" }}>
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
}

export function SessionsCarousel() {
  const sessions = digitalVisibilityClinic.sessions;
  const [expanded, setExpanded] = useState(false);

  const PREVIEW_COUNT = 2;
  const shown = expanded ? sessions : sessions.slice(0, PREVIEW_COUNT);
  const hiddenCount = sessions.length - PREVIEW_COUNT;

  return (
    <>
      {/* Desktop (lg+): static vertical list */}
      <div className="hidden lg:block space-y-3">
        {sessions.map((session) => (
          <SessionRow key={session.number} session={session} />
        ))}
      </div>

      {/* Mobile (< lg): first N sessions + show-more button */}
      <div className="lg:hidden space-y-3">
        {shown.map((session, i) => {
          const color = SESSION_COLORS[i] ?? "#10B981";
          return (
            <SessionCard
              key={session.number}
              session={session}
              color={color}
              total={sessions.length}
            />
          );
        })}

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "rgba(37,99,235,0.06)",
              border: "1px solid rgba(37,99,235,0.2)",
              color: "#60A5FA",
            }}
          >
            Show all {sessions.length} sessions
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
}
