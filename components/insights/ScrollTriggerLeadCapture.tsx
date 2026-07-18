"use client";

import { useEffect, useRef, useState } from "react";
import { LeadCaptureWidget } from "./LeadCaptureWidget";

interface ScrollTriggerLeadCaptureProps {
  articleTitle?: string;
  /** Fraction of page height at which to trigger (default 0.6 = 60%) */
  threshold?: number;
}

export function ScrollTriggerLeadCapture({
  articleTitle,
  threshold = 0.6,
}: ScrollTriggerLeadCaptureProps) {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (triggered.current) return;
      const scrolled     = window.scrollY + window.innerHeight;
      const total        = document.documentElement.scrollHeight;
      if (scrolled / total >= threshold) {
        triggered.current = true;
        setVisible(true);
        window.removeEventListener("scroll", onScroll, { passive: true } as EventListenerOptions);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll, { passive: true } as EventListenerOptions);
  }, [threshold]);

  if (!visible) return null;

  return (
    <div
      className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <LeadCaptureWidget articleTitle={articleTitle} />
    </div>
  );
}
