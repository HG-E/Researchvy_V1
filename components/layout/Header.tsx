"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { mainNav } from "@/constants/navigation";

const MobileDrawer = dynamic(
  () => import("./MobileDrawer").then((m) => ({ default: m.MobileDrawer })),
  { ssr: false }
);

export function Header() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target as Node)) {
        setEcosystemOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(15, 23, 42, 0.97)" : "#0F172A",
          borderColor: "#1E293B",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo variant="full" width={130} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {mainNav.map((item) => {
              if (item.children) {
                return (
                  <div key={item.href} className="relative" ref={ecosystemRef}>
                    <button
                      className="flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: ecosystemOpen ? "#F9FAFB" : "#9CA3AF" }}
                      onMouseEnter={() => setEcosystemOpen(true)}
                      onClick={() => setEcosystemOpen(!ecosystemOpen)}
                    >
                      {item.label}
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform duration-200"
                        style={{ transform: ecosystemOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    {/* CSS-transition dropdown — no framer-motion */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl border p-2 shadow-2xl"
                      style={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        opacity: ecosystemOpen ? 1 : 0,
                        transform: `translateX(-50%) translateY(${ecosystemOpen ? "0px" : "8px"}) scale(${ecosystemOpen ? 1 : 0.97})`,
                        pointerEvents: ecosystemOpen ? "auto" : "none",
                        transition: "opacity 0.18s ease, transform 0.18s ease",
                      }}
                      onMouseLeave={() => setEcosystemOpen(false)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#1E293B]"
                          style={{ color: "#9CA3AF" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                          onClick={() => setEcosystemOpen(false)}
                        >
                          <span className="block text-sm font-semibold">{child.label}</span>
                          {child.description && (
                            <span className="block text-xs mt-0.5" style={{ color: "#4B5563" }}>
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: "#9CA3AF" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#9CA3AF" }}
            >
              Sign In
            </Link>
            <Link
              href="/clinics"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
              style={{ backgroundColor: "#2563EB" }}
            >
              Join a Clinic
            </Link>
          </div>

          {/* Mobile toggle — 44px touch target */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg -mr-1.5 active:bg-[#1E293B] transition-colors"
            style={{ color: "#9CA3AF" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
