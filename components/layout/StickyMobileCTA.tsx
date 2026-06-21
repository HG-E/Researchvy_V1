"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on clinics pages — that's where the button leads
  const isClinicPage = pathname === "/clinics" || pathname.startsWith("/clinics/");

  useEffect(() => {
    if (isClinicPage) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH    = document.documentElement.scrollHeight;
      const winH    = window.innerHeight;
      setVisible(scrollY > 500 && scrollY < docH - winH - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isClinicPage]);

  if (isClinicPage) return null;

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
          backgroundColor:     "rgba(10,15,26,0.97)",
          borderColor:         "#1E293B",
          backdropFilter:      "blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
        }}
      >
        <Link
          href="/clinics"
          className="block w-full rounded-xl py-3.5 text-sm font-bold text-white text-center active:scale-[0.97] active:opacity-90"
          style={{
            backgroundColor: "#2563EB",
            transition: "transform 100ms ease, opacity 100ms ease, background-color 150ms ease",
          }}
        >
          Join a Clinic →
        </Link>
      </div>
    </div>
  );
}
