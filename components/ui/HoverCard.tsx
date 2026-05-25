"use client";

import { useState } from "react";

interface HoverCardProps {
  accentColor: string;
  className?: string;
  children: React.ReactNode;
}

export function HoverCard({ accentColor, className = "", children }: HoverCardProps) {
  const [over, setOver] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${className}`}
      style={{
        backgroundColor: "#0F172A",
        borderColor: over ? `${accentColor}40` : "#1E293B",
        transform: over ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      {children}
    </div>
  );
}
