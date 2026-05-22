"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { mainNav } from "@/constants/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <Logo variant="full" width={140} />

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
                            className="block rounded-lg px-3 py-2.5 transition-colors"
                            style={{ color: "#9CA3AF" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#1E293B";
                              e.currentTarget.style.color = "#F9FAFB";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#9CA3AF";
                            }}
                            onClick={() => setEcosystemOpen(false)}
                          >
                            <span className="block text-sm font-semibold">{child.label}</span>
                            {child.description && (
                              <span
                                className="block text-xs mt-0.5"
                                style={{ color: "#4B5563" }}
                              >
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
                className="text-sm font-medium transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
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
            className="text-sm font-medium transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            Sign In
          </Link>
          <Link
            href="/clinics"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            Join a Clinic
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: "#9CA3AF" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="px-4 py-4 space-y-1">
              {mainNav.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-sm font-medium py-2.5 px-3 rounded-lg"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1E293B";
                      e.currentTarget.style.color = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#9CA3AF";
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                          style={{ color: "#6B7280" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div
                className="pt-3 mt-3 border-t flex flex-col gap-2"
                style={{ borderColor: "#1E293B" }}
              >
                <Link
                  href="/signin"
                  className="text-sm font-medium py-2.5 px-3 rounded-lg"
                  style={{ color: "#9CA3AF" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/clinics"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white text-center"
                  style={{ backgroundColor: "#2563EB" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Join a Clinic
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
