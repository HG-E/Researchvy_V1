"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Session = {
  number:      number;
  title:       string;
  subtitle?:   string;
  description: string;
  topics:      readonly string[];
  isBonus?:    boolean;
};

export function SessionAccordion({ sessions }: { sessions: readonly Session[] }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isOpen    = open === session.number;
        const isBonus   = !!session.isBonus;
        const accent    = isBonus ? "#F59E0B" : "#2563EB";
        const accentBg  = isBonus ? "rgba(245,158,11,0.12)" : "rgba(37,99,235,0.12)";

        return (
          <div
            key={session.number}
            className="rounded-2xl border overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: "#FFFFFF", borderColor: isOpen ? accent : "#1E293B" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : session.number)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: isOpen ? accent : "#1E293B",
                    color: isOpen ? "#fff" : accent,
                  }}
                >
                  {session.number}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-medium" style={{ color: "#6B7280" }}>
                      {isBonus ? "Bonus Masterclass" : `Module ${session.number}`}
                    </p>
                    {isBonus && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: accentBg, color: accent }}
                      >
                        Bonus
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#111827" }}>
                    {session.title}
                  </p>
                  {session.subtitle && (
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                      {session.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown
                className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#6B7280" }}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: "#E2E8F0" }}>
                <p className="text-sm mt-4 mb-4 leading-relaxed" style={{ color: "#6B7280" }}>
                  {session.description}
                </p>
                <ul className="space-y-2">
                  {session.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
