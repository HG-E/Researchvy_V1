"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on the scorecard page (that's where the button leads) or on clinics
  const isSuppressed =
    pathname === "/clinics" ||
    pathname.startsWith("/clinics/") ||
    pathname === "/resources/visibility-scorecard";

  useEffect(() => {
    if (isSuppressed) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH    = document.documentElement.scrollHeight;
      const winH    = window.innerHeight;
      setVisible(scrollY > 500 && scrollY < docH - winH - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isSuppressed]);

  if (isSuppressed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div
        className="px-4 py-3 border-t"
        style={{
          backgroundColor:     "rgba(255,255,255,0.97)",
          borderColor:         "#E2E8F0",
          backdropFilter:      "blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
        }}
      >
        <Link
          href="/resources/visibility-scorecard"
          className="block w-full rounded-xl py-3.5 text-sm font-bold text-white text-center active:scale-[0.97] active:opacity-90"
          style={{
            backgroundColor: "#10B981",
            transition: "transform 100ms ease, opacity 100ms ease, background-color 150ms ease",
          }}
        >
          Check My Score Free →
        </Link>
      </div>
    </div>
  );
}
