"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "agenda",   label: "What We Cover" },
  { id: "register", label: "Register" },
];

export function PreClinicSectionNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    // Track intersecting sections and always highlight the topmost one —
    // entries can arrive in any order, and near section boundaries more
    // than one section may be intersecting at once.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const topmost = SECTIONS.find(s => intersecting.has(s.id));
        if (topmost) setActive(topmost.id);
      },
      { rootMargin: "-112px 0px -70% 0px", threshold: 0 }
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-40 -mx-4 sm:-mx-6 lg:-mx-8 mb-10 border-b backdrop-blur"
      style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#E2E8F0" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1 overflow-x-auto py-2.5 scroll-hide">
          {SECTIONS.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="inline-block rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
                style={{
                  color:           active === id ? "#FFFFFF" : "#1F2937",
                  backgroundColor: active === id ? "#2563EB" : "transparent",
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
