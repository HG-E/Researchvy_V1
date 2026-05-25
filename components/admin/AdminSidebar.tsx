"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, Award, Unlock, LogOut, ChevronRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { supabase } from "@/lib/db/client";

const NAV = [
  { href: "/admin",              label: "Overview",         icon: LayoutDashboard },
  { href: "/admin/enquiries",    label: "Enquiries",        icon: Inbox },
  { href: "/admin/certificates", label: "Certificates",     icon: Award },
  { href: "/admin/cohorts",      label: "Session Unlocks",  icon: Unlock },
];

export function AdminSidebar({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <aside
      className="w-60 shrink-0 flex flex-col border-r"
      style={{ backgroundColor: "#0A1120", borderColor: "#1E293B" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#1E293B" }}>
        <Logo variant="full" width={110} linkToHome />
        <p className="text-[10px] font-semibold tracking-widest uppercase mt-2" style={{ color: "#2563EB" }}>
          Administration
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "rgba(37,99,235,0.12)" : "transparent",
                color: active ? "#60A5FA" : "#6B7280",
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin identity + sign out */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "#1E293B" }}>
        <div className="px-3 mb-3">
          <p className="text-xs font-semibold truncate" style={{ color: "#F9FAFB" }}>
            {adminName || "Admin"}
          </p>
          <p className="text-[11px] truncate" style={{ color: "#4B5563" }}>
            {adminEmail}
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10"
          style={{ color: "#6B7280" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
