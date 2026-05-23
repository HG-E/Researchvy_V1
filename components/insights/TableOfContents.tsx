"use client";

import { useState, useEffect } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
        Contents
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ paddingLeft: level === 3 ? "0.75rem" : 0 }}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-xs leading-relaxed py-0.5 transition-all duration-150 border-l-2 pl-3"
                style={{
                  color:       isActive ? "#60A5FA" : "#6B7280",
                  borderColor: isActive ? "#2563EB" : "transparent",
                  fontWeight:  isActive ? 600 : 400,
                }}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
