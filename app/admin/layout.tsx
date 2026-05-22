import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

const adminNav = [
  { label: "Overview",   href: "/admin" },
  { label: "Clinics",    href: "/admin/clinics" },
  { label: "Content",    href: "/admin/content" },
  { label: "Users",      href: "/admin/users" },
  { label: "Analytics",  href: "/admin/analytics" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/admin");

  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) redirect("/dashboard");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Admin sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-r"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "#1E293B" }}>
          <Logo variant="icon" width={28} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4B5563" }}>
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Admin navigation">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
              style={{ color: "#6B7280" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="px-4 py-3 border-t text-xs"
          style={{ borderColor: "#1E293B", color: "#4B5563" }}
        >
          {user.email}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
