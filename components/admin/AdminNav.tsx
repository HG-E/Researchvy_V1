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
  Globe,
  CalendarDays,
  Award,
  ClipboardCheck,
  Target,
  Bell,
} from "lucide-react";

const NAV = [
  { label: "Overview",        href: "/admin",                     icon: LayoutDashboard, exact: true  },
  { label: "Review Queue",    href: "/admin/review",              icon: ClipboardCheck,  exact: false },
  { label: "Scorecard Leads", href: "/admin/scorecard",           icon: Target,          exact: false },
  { label: "Orders",          href: "/admin/orders",              icon: ShoppingBag,     exact: false },
  { label: "Events",        href: "/admin/events",               icon: CalendarDays,    exact: false },
  { label: "Enquiries",     href: "/admin/enquiries",            icon: Inbox,           exact: false },
  { label: "Waitlist",      href: "/admin/waitlist",             icon: Bell,            exact: false },
  { label: "Partnerships",  href: "/admin/partnerships",         icon: Handshake,       exact: false },
  { label: "Opportunities", href: "/admin/opportunities",        icon: Globe,           exact: false },
  { label: "Content",       href: "/admin/content",              icon: FileText,        exact: false },
  { label: "Clinics",       href: "/admin/clinics",              icon: BookOpen,        exact: false },
  { label: "Academy",       href: "/admin/academy",              icon: Layers,          exact: false },
  { label: "Enrollments",   href: "/admin/enrollments",          icon: GraduationCap,   exact: false },
  { label: "Certificates",  href: "/admin/certificates",         icon: Award,           exact: false },
  { label: "Users",         href: "/admin/users",                icon: Users,           exact: false },
  { label: "Analytics",     href: "/admin/analytics",            icon: BarChart2,       exact: false },
];

interface Props {
  pendingCount?:             number;
  newScorecardCount?:        number;
  submittedOrderCount?:      number;
  pendingParticipantsCount?: number;
}

export function AdminNav({ pendingCount = 0, newScorecardCount = 0, submittedOrderCount = 0, pendingParticipantsCount = 0 }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Admin navigation">
      {NAV.map(({ label, href, icon: Icon, exact }) => {
        const active        = exact ? pathname === href : pathname.startsWith(href);
        const isReviewQueue = href === "/admin/review";
        const isScorecard   = href === "/admin/scorecard";
        const isOrders      = href === "/admin/orders";
        const isClinics     = href === "/admin/clinics";
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
            <span className="flex-1">{label}</span>
            {isReviewQueue && pendingCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{ backgroundColor: "rgba(245,158,11,0.2)", color: "#FCD34D" }}
              >
                {pendingCount}
              </span>
            )}
            {isScorecard && newScorecardCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{ backgroundColor: "rgba(16,185,129,0.2)", color: "#34D399" }}
              >
                {newScorecardCount}
              </span>
            )}
            {isOrders && submittedOrderCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{ backgroundColor: "rgba(99,102,241,0.25)", color: "#A5B4FC" }}
              >
                {submittedOrderCount}
              </span>
            )}
            {isClinics && pendingParticipantsCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{ backgroundColor: "rgba(245,158,11,0.2)", color: "#FCD34D" }}
              >
                {pendingParticipantsCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
