"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  dotColor?: string;
  className?: string;
}

export function MobileCarousel({
  items,
  autoPlay = false,
  autoPlayDelay = 4000,
  dotColor = "#2563EB",
  className = "",
}: Props) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const activeRef   = useRef(0);
  const pausedRef   = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const count = items.length;

  // Pause auto-play for 3 s after any user interaction, then silently resume
  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 3000);
  }, []);

  // Cleanup resume timer on unmount
  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  // Track active slide index from native scroll position
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.offsetWidth;
      if (!w) return;
      const idx = Math.round(el.scrollLeft / w);
      activeRef.current = idx;
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback((index: number, manual = false) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
    activeRef.current = index;
    setActive(index);
    if (manual) pause();
  }, [pause]);

  // Attach pause to touch/pointer events so user swipes interrupt auto-play
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !autoPlay) return;
    el.addEventListener("touchstart",  pause, { passive: true });
    el.addEventListener("pointerdown", pause, { passive: true });
    return () => {
      el.removeEventListener("touchstart",  pause);
      el.removeEventListener("pointerdown", pause);
    };
  }, [autoPlay, pause]);

  // Nudge hint — only when auto-play is off (auto-play self-reveals the carousel)
  useEffect(() => {
    if (count <= 1 || autoPlay) return;
    const t1 = setTimeout(() => {
      trackRef.current?.scrollTo({ left: 28, behavior: "smooth" });
    }, 900);
    const t2 = setTimeout(() => {
      trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }, 1450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [count, autoPlay]);

  // Auto-play — skips tick when user recently interacted
  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const iv = setInterval(() => {
      if (pausedRef.current) return;
      const next = (activeRef.current + 1) % count;
      goTo(next);
    }, autoPlayDelay);
    return () => clearInterval(iv);
  }, [autoPlay, autoPlayDelay, count, goTo]);

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      {/* Scroll track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-hide"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-start">
            {item}
          </div>
        ))}
      </div>

      {/* Dot indicators — clickable, counts as manual interaction */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, true)}
              aria-label={`Slide ${i + 1} of ${count}`}
              style={{
                width:           i === active ? 20 : 7,
                height:          7,
                borderRadius:    4,
                backgroundColor: i === active ? dotColor : "#1E293B",
                transition:      "width 0.3s ease, background-color 0.3s ease",
                border:          "none",
                cursor:          "pointer",
                padding:         0,
                flexShrink:      0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
