"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, GraduationCap, BookOpen, Award, User, LogOut, Layers } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { DashUser } from "@/app/dashboard/layout";

const NAV_ITEMS = [
  { href: "/dashboard",              label: "Overview",     Icon: LayoutDashboard },
  { href: "/dashboard/clinics",      label: "My Clinics",   Icon: GraduationCap },
  { href: "/dashboard/academy",      label: "Academy",      Icon: Layers },
  { href: "/dashboard/resources",    label: "Resources",    Icon: BookOpen },
  { href: "/dashboard/certificates", label: "Certificates", Icon: Award },
  { href: "/dashboard/profile",      label: "Profile",      Icon: User },
];

export function MobileDashboardNav({ user }: { user: DashUser }) {
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

  const displayName = user.full_name?.split(" ")[0] || user.email.split("@")[0];

  return (
    <>
      {/* Top bar */}
      <header
        className="md:hidden flex items-center justify-between px-4 border-b"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B", height: "56px" }}
      >
        <Logo variant="icon" width={28} linkToHome />
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-xl active:bg-[#1E293B] transition-colors"
          style={{ color: "#6B7280" }}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-xs flex flex-col md:hidden"
        style={{
          backgroundColor: "#0A0F1A",
          borderLeft:      "1px solid #1E293B",
          transform:       open ? "translateX(0)" : "translateX(100%)",
          transition:      "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom:   "env(safe-area-inset-bottom)",
        }}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="Dashboard navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0" style={{ borderColor: "#1E293B" }}>
          <Logo variant="full" width={110} linkToHome />
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-xl active:bg-[#1E293B] transition-colors"
            style={{ color: "#6B7280" }}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User identity */}
        <Link
          href="/dashboard/profile"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-5 py-3.5 border-b transition-colors active:bg-[#1E293B]"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <UserAvatar name={user.full_name} email={user.email} avatarUrl={user.avatar_url} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
              {displayName}
            </p>
            <p className="text-xs truncate" style={{ color: "#6B7280" }}>
              {user.email}
            </p>
          </div>
        </Link>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scroll-contain" aria-label="Dashboard navigation">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors relative active:opacity-75"
                style={{
                  backgroundColor: isActive ? "#1E293B" : "transparent",
                  color:           isActive ? "#F9FAFB" : "#6B7280",
                  minHeight:       "48px",
                }}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: isActive ? "#60A5FA" : "#4B5563" }} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t flex-shrink-0" style={{ borderColor: "#1E293B" }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-sm font-medium transition-colors active:bg-[#1E293B]"
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
