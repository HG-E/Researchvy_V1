"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, Shield, ChevronDown, GraduationCap } from "lucide-react";
import { UserAvatar } from "@/components/common/UserAvatar";

export type HeaderUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatar_url: string | null;
};

export function UserButton({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const router          = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    setOpen(false);
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const displayName = user.name?.split(" ")[0] ?? user.email.split("@")[0];
  const isAdmin     = user.role === "admin";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-[#1E293B]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar name={user.name} email={user.email} avatarUrl={user.avatar_url} size="sm" />
        <span
          className="hidden lg:block text-sm font-medium max-w-[120px] truncate"
          style={{ color: "#F9FAFB" }}
        >
          {displayName}
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200"
          style={{
            color:     "#6B7280",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute top-full right-0 mt-2 w-56 rounded-xl border p-1.5 shadow-2xl z-50"
        style={{
          backgroundColor: "#0F172A",
          borderColor:     "#1E293B",
          opacity:         open ? 1 : 0,
          transform:       `translateY(${open ? "0px" : "6px"}) scale(${open ? 1 : 0.97})`,
          pointerEvents:   open ? "auto" : "none",
          transition:      "opacity 0.15s ease, transform 0.15s ease",
        }}
        role="menu"
      >
        {/* Identity header */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b mb-1" style={{ borderColor: "#1E293B" }}>
          <UserAvatar name={user.name} email={user.email} avatarUrl={user.avatar_url} size="sm" />
          <div className="min-w-0">
            {user.name && (
              <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
                {user.name}
              </p>
            )}
            <p className="text-xs truncate" style={{ color: "#6B7280" }}>
              {user.email}
            </p>
          </div>
        </div>

        <MenuItem href="/dashboard"         icon={LayoutDashboard} label="Dashboard"        onClose={() => setOpen(false)} />
        <MenuItem href="/dashboard/clinics" icon={GraduationCap}   label="My Clinics"       onClose={() => setOpen(false)} />
        <MenuItem href="/dashboard/profile" icon={User}            label="Profile Settings" onClose={() => setOpen(false)} />

        {isAdmin && (
          <>
            <div className="my-1 mx-1.5 h-px" style={{ backgroundColor: "#1E293B" }} />
            <MenuItem
              href="/admin"
              icon={Shield}
              label="Admin Panel"
              onClose={() => setOpen(false)}
              color="#FCA5A5"
            />
          </>
        )}

        <div className="my-1 mx-1.5 h-px" style={{ backgroundColor: "#1E293B" }} />

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#1E293B]"
          style={{ color: "#6B7280" }}
          role="menuitem"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  color,
  onClose,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#1E293B]"
      style={{ color: color ?? "#9CA3AF" }}
      role="menuitem"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Link>
  );
}
