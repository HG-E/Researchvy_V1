"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number } | null;

function calc(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)      / 1_000),
  };
}

export function EarlyBirdCountdown({ deadline }: { deadline: string }) {
  // Initialize with calc() so first render matches SSR — prevents layout shift
  const [time, setTime] = useState<TimeLeft>(() => calc(deadline));

  useEffect(() => {
    setTime(calc(deadline));
    const id = setInterval(() => setTime(calc(deadline)), 1_000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!time) return null;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs">
      {([
        { v: time.days,    l: "d" },
        { v: time.hours,   l: "h" },
        { v: time.minutes, l: "m" },
        { v: time.seconds, l: "s" },
      ] as const).map(({ v, l }) => (
        <span key={l} className="flex items-center gap-0.5">
          <span className="tabular-nums font-bold" style={{ color: "#FCD34D" }}>
            {String(v).padStart(2, "0")}
          </span>
          <span style={{ color: "#4B5563" }}>{l}</span>
        </span>
      ))}
    </span>
  );
}
