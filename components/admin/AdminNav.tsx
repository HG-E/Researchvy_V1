"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  BarChart2,
  Inbox,
  Handshake,
  GraduationCap,
  Layers,
  ShoppingBag,
} from "lucide-react";

const NAV = [
  { label: "Overview",    href: "/admin",               icon: LayoutDashboard, exact: true  },
  { label: "Orders",      href: "/admin/orders",         icon: ShoppingBag,     exact: false },
  { label: "Enquiries",   href: "/admin/enquiries",      icon: Inbox,           exact: false },
  { label: "Partnerships",href: "/admin/partnerships",   icon: Handshake,       exact: false },
  { label: "Content",     href: "/admin/content",        icon: FileText,        exact: false },
  { label: "Clinics",     href: "/admin/clinics",        icon: BookOpen,        exact: false },
  { label: "Academy",     href: "/admin/academy",        icon: Layers,          exact: false },
  { label: "Enrollments", href: "/admin/enrollments",    icon: GraduationCap,   exact: false },
  { label: "Users",       href: "/admin/users",          icon: Users,           exact: false },
  { label: "Analytics",   href: "/admin/analytics",      icon: BarChart2,       exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Admin navigation">
      {NAV.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            style={{
              color:           active ? "#F9FAFB"   : "#6B7280",
              backgroundColor: active ? "#1E293B"   : "transparent",
            }}
          >
            <Icon
              className="h-4 w-4 flex-shrink-0"
              style={{ color: active ? "#60A5FA" : "#4B5563" }}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
