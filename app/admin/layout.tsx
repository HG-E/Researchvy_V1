import { Logo } from "@/components/common/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "#080E1A" }}>
      {/* Mobile top bar + drawer */}
      <AdminMobileNav email={user.email ?? ""} />

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-r"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
      >
        {/* Logo + label */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "#1E293B" }}>
          <Logo variant="icon" width={28} />
          <div>
            <p className="text-xs font-bold leading-none" style={{ color: "#F9FAFB" }}>Researchvy</p>
            <p className="text-[10px] tracking-widest uppercase leading-none mt-0.5" style={{ color: "#4B5563" }}>Admin</p>
          </div>
        </div>

        <AdminNav />

        {/* Footer: email + sign out */}
        <div className="px-4 py-3 border-t space-y-1" style={{ borderColor: "#1E293B" }}>
          <p className="text-[11px] truncate px-2 py-1" style={{ color: "#4B5563" }}>{user.email}</p>
          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 min-w-0" style={{ backgroundColor: "#080E1A" }}>
        {children}
      </main>
    </div>
  );
}
