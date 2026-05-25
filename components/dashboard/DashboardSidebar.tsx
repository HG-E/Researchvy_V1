"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, GraduationCap, BookOpen, Award, User, LogOut, Layers } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { supabase } from "@/lib/db/client";

const NAV_ITEMS = [
  { href: "/dashboard",               label: "Overview",     Icon: LayoutDashboard },
  { href: "/dashboard/clinics",        label: "My Clinics",   Icon: GraduationCap },
  { href: "/dashboard/academy",        label: "Academy",      Icon: Layers },
  { href: "/dashboard/resources",      label: "Resources",    Icon: BookOpen },
  { href: "/dashboard/certificates",   label: "Certificates", Icon: Award },
  { href: "/dashboard/profile",        label: "Profile",      Icon: User },
];

export function DashboardSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = userEmail
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 border-r"
      style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-5 py-4 border-b"
        style={{ borderColor: "#1E293B" }}
      >
        <Logo variant="full" width={110} linkToHome />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative"
              style={{
                backgroundColor: isActive ? "#1E293B" : "transparent",
                color: isActive ? "#F9FAFB" : "#6B7280",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#111827";
                  e.currentTarget.style.color = "#9CA3AF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6B7280";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ backgroundColor: "#2563EB" }}
                />
              )}
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "#1E293B" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: "#2563EB", color: "#fff" }}
          >
            {initials || "R"}
          </div>
          <span className="text-xs truncate flex-1" style={{ color: "#6B7280" }}>
            {userEmail}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: "#4B5563" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#111827";
            e.currentTarget.style.color = "#EF4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#4B5563";
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
