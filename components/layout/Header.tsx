"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { mainNav } from "@/constants/navigation";
import { UserButton } from "./UserButton";
import type { HeaderUser } from "./UserButton";

const MobileDrawer = dynamic(
  () => import("./MobileDrawer").then((m) => ({ default: m.MobileDrawer })),
  { ssr: false }
);

export function Header({ serverUser }: { serverUser?: HeaderUser | null }) {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const pathname     = usePathname();

  const ecosystemActive = mainNav
    .find((i) => i.children)
    ?.children?.some((c) => pathname.startsWith(c.href)) ?? false;

  function isNavActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

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
          paddingTop:           "env(safe-area-inset-top)",
          backgroundColor:      scrolled ? "rgba(15, 23, 42, 0.97)" : "#0F172A",
          borderColor:          "#1E293B",
          backdropFilter:       scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo variant="full" width={130} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {mainNav.map((item) => {
              if (item.children) {
                const isActive = ecosystemActive || ecosystemOpen;
                return (
                  <div key={item.href} className="relative" ref={ecosystemRef}>
                    <button
                      className="flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: isActive ? "#F9FAFB" : "#9CA3AF" }}
                      onMouseEnter={() => setEcosystemOpen(true)}
                      onClick={() => setEcosystemOpen(!ecosystemOpen)}
                      aria-expanded={ecosystemOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform duration-200"
                        style={{ transform: ecosystemOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        aria-hidden="true"
                      />
                    </button>
                    {isActive && !ecosystemOpen && (
                      <span
                        className="absolute -bottom-[19px] left-0 right-0 h-px"
                        style={{ backgroundColor: "#2563EB" }}
                      />
                    )}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl border p-2 shadow-2xl"
                      style={{
                        backgroundColor: "#0F172A",
                        borderColor:     "#1E293B",
                        opacity:         ecosystemOpen ? 1 : 0,
                        transform:       `translateX(-50%) translateY(${ecosystemOpen ? "0px" : "8px"}) scale(${ecosystemOpen ? 1 : 0.97})`,
                        pointerEvents:   ecosystemOpen ? "auto" : "none",
                        transition:      "opacity 0.18s ease, transform 0.18s ease",
                      }}
                      role="menu"
                      onMouseLeave={() => setEcosystemOpen(false)}
                    >
                      {item.children.map((child) => {
                        const childActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#1E293B]"
                            style={{ color: childActive ? "#F9FAFB" : "#9CA3AF" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = childActive ? "#F9FAFB" : "#9CA3AF")}
                            onClick={() => setEcosystemOpen(false)}
                          >
                            <span className="block text-sm font-semibold">{child.label}</span>
                            {child.description && (
                              <span className="block text-xs mt-0.5" style={{ color: "#6B7280" }}>
                                {child.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium transition-colors hover:text-white"
                  style={{ color: active ? "#F9FAFB" : "#9CA3AF" }}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-[19px] left-0 right-0 h-px"
                      style={{ backgroundColor: "#2563EB" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right-side: search + UserButton when signed in, else Sign In + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[#1E293B]"
              style={{ color: "#6B7280" }}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            {serverUser ? (
              <UserButton user={serverUser} />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: isNavActive("/signin") ? "#F9FAFB" : "#9CA3AF" }}
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
              </>
            )}
          </div>

          {/* Mobile toggle */}
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

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} serverUser={serverUser} />
    </>
  );
}
