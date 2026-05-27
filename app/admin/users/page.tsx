import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { Users, AlertCircle } from "lucide-react";
import { UsersTable } from "@/components/admin/UsersTable";
import type { UserRow } from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Manage Users" });

async function getUsers(): Promise<{ users: UserRow[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });
    if (error) return { users: [], error: true };

    const ids = data.users.map((u: { id: string }) => u.id);
    const { data: profiles } = await admin
      .from("users")
      .select("id, role, full_name")
      .in("id", ids);

    const profileMap = Object.fromEntries(
      (profiles ?? []).map((p: { id: string; role: string; full_name: string }) => [
        p.id, { role: p.role, full_name: p.full_name },
      ])
    );

    return {
      users: data.users.map((u: {
        id: string;
        email?: string;
        created_at: string;
        last_sign_in_at?: string | null;
        banned_until?: string | null;
        email_confirmed_at?: string | null;
        user_metadata?: Record<string, unknown>;
      }) => ({
        id:              u.id,
        email:           u.email ?? "(no email)",
        full_name:       (profileMap[u.id]?.full_name as string) || "",
        role:            (profileMap[u.id]?.role as string) ?? "user",
        created_at:      u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        banned_until:    u.banned_until ?? null,
        flagged:         !!(u.user_metadata?.flagged),
        flagged_reason:  (u.user_metadata?.flagged_reason as string) || null,
        email_confirmed: !!u.email_confirmed_at,
        is_super:        isSuperAdmin(u.email),
      })),
      error: false,
    };
  } catch {
    return { users: [], error: true };
  }
}

export default async function ManageUsersPage() {
  const [{ users, error }, currentUser] = await Promise.all([
    getUsers(),
    getServerUser(),
  ]);
  const callerIsSuper = isSuperAdmin(currentUser?.email);

  const suspendedCount  = users.filter(u => !!(u.banned_until && new Date(u.banned_until) > new Date())).length;
  const flaggedCount    = users.filter(u => u.flagged).length;
  const unverifiedCount = users.filter(u => !u.email_confirmed).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Users
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Users
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {error
            ? "Could not load users."
            : `${users.length} account${users.length !== 1 ? "s" : ""} · ${suspendedCount} suspended · ${flaggedCount} flagged · ${unverifiedCount} unverified`}
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Check that <code className="text-xs px-1 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>SUPABASE_SERVICE_ROLE_KEY</code> is set in your environment.
          </p>
        </div>
      )}

      {!error && users.length === 0 && (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "#2563EB" }} />
          <p className="text-sm font-medium" style={{ color: "#F9FAFB" }}>No users yet</p>
        </div>
      )}

      {!error && users.length > 0 && (
        <UsersTable
          users={users}
          currentUserId={currentUser?.id ?? ""}
          callerIsSuper={callerIsSuper}
        />
      )}
    </div>
  );
}
