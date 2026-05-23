"use client";

import { useState, useEffect } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-0.5 transition-all duration-75 ease-linear"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #2563EB, #60A5FA)",
        boxShadow: "0 0 8px rgba(37,99,235,0.6)",
      }}
    />
  );
}
