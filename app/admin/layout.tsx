import { Logo } from "@/components/common/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole, isSuperAdmin } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { Crown } from "lucide-react";

async function getPendingCount(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const [{ count: oppCount }, { count: evtCount }] = await Promise.all([
      admin.from("research_opportunities").select("*", { count: "exact", head: true }).eq("submission_status", "pending"),
      admin.from("events").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    return (oppCount ?? 0) + (evtCount ?? 0);
  } catch {
    return 0;
  }
}

async function getNewScorecardCount(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { count } = await admin
      .from("visibility_scorecard_leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/admin");

  const { allowed, role } = await requireRole(user.id, "admin");
  // Only redirect if we successfully fetched a role that is insufficient.
  // If role is null, the DB query failed — don't redirect (could be transient).
  if (!allowed && role !== null) redirect("/dashboard");

  const [pendingCount, newScorecardCount] = await Promise.all([
    getPendingCount(),
    getNewScorecardCount(),
  ]);

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

        <AdminNav pendingCount={pendingCount} newScorecardCount={newScorecardCount} />

        {/* Footer: identity + sign out */}
        <div className="px-4 py-3 border-t space-y-1" style={{ borderColor: "#1E293B" }}>
          <div className="flex items-center gap-1.5 px-2 py-1 min-w-0">
            {isSuperAdmin(user.email) && (
              <Crown className="h-3 w-3 flex-shrink-0" style={{ color: "#FCD34D" }} />
            )}
            <p className="text-[11px] truncate" style={{ color: isSuperAdmin(user.email) ? "#FCD34D" : "#4B5563" }}>
              {isSuperAdmin(user.email) ? "Super Admin" : user.email}
            </p>
          </div>
          {isSuperAdmin(user.email) && (
            <p className="text-[10px] truncate px-2" style={{ color: "#4B5563" }}>{user.email}</p>
          )}
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
