import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { format } from "date-fns";
import { Users, Shield, AlertCircle, Flag } from "lucide-react";
import { UserActionsMenu } from "@/components/admin/UserActionsMenu";

export const metadata = generatePageMetadata({ title: "Manage Users" });

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:      { bg: "rgba(239,68,68,0.12)",   text: "#FCA5A5" },
  partner:    { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  researcher: { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  user:       { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

type UserRow = {
  id:              string;
  email:           string;
  full_name:       string;
  role:            string;
  created_at:      string;
  last_sign_in_at: string | null;
  banned_until:    string | null;
  flagged:         boolean;
  flagged_reason:  string | null;
};

async function getUsers(): Promise<{ users: UserRow[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
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
      })),
      error: false,
    };
  } catch {
    return { users: [], error: true };
  }
}

export default async function ManageUsersPage() {
  const { users, error } = await getUsers();
  const currentUser      = await getServerUser();

  const isSuspended = (u: UserRow) =>
    !!(u.banned_until && new Date(u.banned_until) > new Date());

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
            : `${users.length} registered account${users.length !== 1 ? "s" : ""}. ${users.filter(isSuspended).length} suspended · ${users.filter((u) => u.flagged).length} flagged.`}
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
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          {/* Table head */}
          <div
            className="grid gap-4 px-5 py-3 text-xs font-semibold tracking-wider uppercase border-b"
            style={{
              gridTemplateColumns: "1fr auto auto auto auto auto",
              backgroundColor:     "#0F172A",
              borderColor:         "#1E293B",
              color:               "#4B5563",
            }}
          >
            <span>User</span>
            <span>Role</span>
            <span className="hidden lg:block">Status</span>
            <span className="hidden md:block">Last sign in</span>
            <span>Joined</span>
            <span />
          </div>

          <div style={{ backgroundColor: "#0F172A" }}>
            {users.map((user, i) => {
              const roleStyle  = ROLE_COLORS[user.role] ?? ROLE_COLORS.user;
              const suspended  = isSuspended(user);
              const isSelf     = user.id === currentUser?.id;

              return (
                <div
                  key={user.id}
                  className="grid gap-4 items-center px-5 py-3.5 border-b last:border-0"
                  style={{
                    gridTemplateColumns: "1fr auto auto auto auto auto",
                    borderColor:         "#1E293B",
                    backgroundColor:     i % 2 === 0 ? "#0F172A" : "#0A1120",
                    opacity:             suspended ? 0.65 : 1,
                  }}
                >
                  {/* Email + name */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                      {user.full_name || user.email}
                    </p>
                    {user.full_name && (
                      <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                        {user.email}
                      </p>
                    )}
                    <p className="text-[10px] font-mono mt-0.5 truncate" style={{ color: "#1E3A5F" }}>
                      {user.id}
                    </p>
                  </div>

                  {/* Role badge */}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                  >
                    {user.role === "admin" && <Shield className="h-3 w-3" />}
                    {user.role}
                  </span>

                  {/* Status badges */}
                  <div className="hidden lg:flex items-center gap-1.5">
                    {suspended && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                        style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#F87171" }}
                      >
                        Suspended
                      </span>
                    )}
                    {user.flagged && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                        title={user.flagged_reason ?? ""}
                        style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
                      >
                        <Flag className="h-2.5 w-2.5" />
                        Flagged
                      </span>
                    )}
                    {!suspended && !user.flagged && (
                      <span className="text-xs" style={{ color: "#1E3A5F" }}>Active</span>
                    )}
                  </div>

                  {/* Last sign in */}
                  <span className="hidden md:block text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                    {user.last_sign_in_at
                      ? format(new Date(user.last_sign_in_at), "MMM d, yyyy")
                      : "Never"}
                  </span>

                  {/* Joined */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </span>

                  {/* Actions */}
                  <UserActionsMenu
                    userId={user.id}
                    currentRole={user.role}
                    status={{ isSuspended: suspended, isFlagged: user.flagged, isSelf }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
