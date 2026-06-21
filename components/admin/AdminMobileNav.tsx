"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LayoutDashboard, Inbox, Handshake,
  FileText, BookOpen, Users, BarChart2, LogOut, Shield, GraduationCap, Layers,
  CalendarDays, Globe, Award, ClipboardCheck,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

const NAV = [
  { label: "Overview",     href: "/admin",              Icon: LayoutDashboard,  exact: true  },
  { label: "Review Queue", href: "/admin/review",       Icon: ClipboardCheck,   exact: false },
  { label: "Events",         href: "/admin/events",         Icon: CalendarDays,    exact: false },
  { label: "Opportunities", href: "/admin/opportunities", Icon: Globe,           exact: false },
  { label: "Enquiries",     href: "/admin/enquiries",     Icon: Inbox,           exact: false },
  { label: "Partnerships", href: "/admin/partnerships", Icon: Handshake,       exact: false },
  { label: "Content",      href: "/admin/content",      Icon: FileText,        exact: false },
  { label: "Clinics",      href: "/admin/clinics",      Icon: BookOpen,        exact: false },
  { label: "Academy",      href: "/admin/academy",      Icon: Layers,          exact: false },
  { label: "Enrollments",   href: "/admin/enrollments",  Icon: GraduationCap,   exact: false },
  { label: "Certificates",  href: "/admin/certificates", Icon: Award,           exact: false },
  { label: "Users",         href: "/admin/users",        Icon: Users,           exact: false },
  { label: "Analytics",    href: "/admin/analytics",    Icon: BarChart2,       exact: false },
];

export function AdminMobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();
  const router          = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Top bar */}
      <header
        className="md:hidden flex items-center justify-between px-4 border-b"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B", height: "56px" }}
      >
        <div className="flex items-center gap-2">
          <Logo variant="icon" width={24} />
          <div>
            <p className="text-xs font-bold leading-none" style={{ color: "#F9FAFB" }}>Researchvy</p>
            <p className="text-[9px] tracking-widest uppercase leading-none mt-0.5" style={{ color: "#4B5563" }}>Admin</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-xl active:bg-[#1E293B] transition-colors"
          style={{ color: "#6B7280" }}
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col md:hidden"
        style={{
          backgroundColor: "#0A0F1A",
          borderRight:     "1px solid #1E293B",
          transform:       open ? "translateX(0)" : "translateX(-100%)",
          transition:      "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0" style={{ borderColor: "#1E293B" }}>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: "#FCA5A5" }} />
            <span className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Admin Panel</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-xl active:bg-[#1E293B] transition-colors"
            style={{ color: "#6B7280" }}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
          {NAV.map(({ label, href, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors relative"
                style={{
                  backgroundColor: active ? "#1E293B" : "transparent",
                  color:           active ? "#F9FAFB" : "#6B7280",
                  minHeight:       "48px",
                }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: active ? "#60A5FA" : "#4B5563" }} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t flex-shrink-0 space-y-1" style={{ borderColor: "#1E293B" }}>
          <p className="text-[11px] truncate px-4 py-1" style={{ color: "#4B5563" }}>{email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-sm font-medium transition-colors"
            style={{ color: "#4B5563", minHeight: "48px" }}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
