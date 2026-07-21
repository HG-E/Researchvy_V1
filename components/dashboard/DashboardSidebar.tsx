"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, GraduationCap, BookOpen, Award, User, LogOut, Layers, Shield, Globe, CalendarDays, Bell } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { DashUser } from "@/app/dashboard/layout";

const NAV_ITEMS = [
  { href: "/dashboard",                  label: "Overview",       Icon: LayoutDashboard },
  { href: "/dashboard/clinics",          label: "My Clinics",     Icon: GraduationCap },
  { href: "/dashboard/academy",          label: "Academy",        Icon: Layers },
  { href: "/dashboard/opportunities",    label: "Opportunities",  Icon: Globe },
  { href: "/dashboard/events",           label: "My Events",      Icon: CalendarDays },
  { href: "/dashboard/resources",        label: "Resources",      Icon: BookOpen },
  { href: "/dashboard/certificates",     label: "Certificates",   Icon: Award },
  { href: "/dashboard/notifications",    label: "Notifications",  Icon: Bell },
  { href: "/dashboard/profile",          label: "Profile",        Icon: User },
];

export function DashboardSidebar({ user }: { user: DashUser }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const displayName = user.full_name?.split(" ")[0] || user.email.split("@")[0];

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 border-r"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      {/* Logo */}
      <div className="flex items-center px-5 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
        <Logo variant="full" width={110} linkToHome />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative"
              style={{
                backgroundColor: isActive ? "#EFF6FF" : "transparent",
                color:           isActive ? "#1D4ED8" : "#6B7280",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "#F1F5F9"; e.currentTarget.style.color = "#374151"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6B7280"; } }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
              )}
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Admin Panel link — only for admins */}
      {user.role === "admin" && (
        <div className="px-3 pb-2">
          <div className="h-px mb-2" style={{ backgroundColor: "#F1F5F9" }} />
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
            style={{ color: "#FCA5A5", backgroundColor: "rgba(239,68,68,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.06)"; }}
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            Admin Panel
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "#E2E8F0" }}>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors hover:bg-[#F1F5F9]"
        >
          <UserAvatar name={user.full_name} email={user.email} avatarUrl={user.avatar_url} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>
              {displayName}
            </p>
            <p className="text-[10px] truncate" style={{ color: "#4B5563" }}>
              {user.email}
            </p>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: "#4B5563" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6B7280"; }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
