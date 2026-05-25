"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { mainNav } from "@/constants/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileEcoOpen, setMobileEcoOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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

  function closeMobile() {
    setMobileOpen(false);
    setMobileEcoOpen(false);
  }

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

                    <AnimatePresence>
                      {ecosystemOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl border p-2 shadow-2xl"
                          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
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
                        </motion.div>
                      )}
                    </AnimatePresence>
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

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "rgba(8,14,26,0.6)", backdropFilter: "blur(4px)" }}
              onClick={closeMobile}
            />

            {/* Drawer — slides in from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm md:hidden flex flex-col"
              style={{ backgroundColor: "#0A0F1A", borderLeft: "1px solid #1E293B" }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 h-16 border-b flex-shrink-0"
                style={{ borderColor: "#1E293B" }}
              >
                <Logo variant="full" width={120} />
                <button
                  onClick={closeMobile}
                  className="flex items-center justify-center w-10 h-10 rounded-lg active:bg-[#1E293B] transition-colors"
                  style={{ color: "#6B7280" }}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav
                className="flex-1 overflow-y-auto scroll-contain px-4 py-5 space-y-1"
                aria-label="Mobile navigation"
              >
                {mainNav.map((item) => {
                  if (item.children) {
                    return (
                      <div key={item.href}>
                        <button
                          onClick={() => setMobileEcoOpen(!mobileEcoOpen)}
                          className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors active:bg-[#1E293B]"
                          style={{ color: mobileEcoOpen ? "#F9FAFB" : "#9CA3AF" }}
                        >
                          {item.label}
                          <ChevronRight
                            className="h-4 w-4 transition-transform duration-200"
                            style={{ transform: mobileEcoOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileEcoOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-2 mt-1 space-y-1 pb-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeMobile}
                                    className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors active:bg-[#1E293B]"
                                  >
                                    <div>
                                      <p className="text-sm font-semibold" style={{ color: "#D1D5DB" }}>
                                        {child.label}
                                      </p>
                                      {child.description && (
                                        <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>
                                          {child.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="block rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors active:bg-[#1E293B]"
                      style={{ color: "#9CA3AF" }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Auth CTAs at bottom */}
              <div
                className="px-5 py-5 border-t space-y-3 flex-shrink-0"
                style={{
                  borderColor: "#1E293B",
                  paddingBottom: "max(20px, env(safe-area-inset-bottom))",
                }}
              >
                <Link
                  href="/signin"
                  onClick={closeMobile}
                  className="block w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-center border transition-colors active:bg-[#1E293B]"
                  style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/clinics"
                  onClick={closeMobile}
                  className="block w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white text-center transition-colors active:opacity-90"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Join a Clinic →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
