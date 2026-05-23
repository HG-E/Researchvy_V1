import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { format } from "date-fns";
import { Users, Shield, AlertCircle } from "lucide-react";

export const metadata = generatePageMetadata({ title: "Manage Users" });

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:      { bg: "rgba(239,68,68,0.12)",   text: "#FCA5A5" },
  partner:    { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  researcher: { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  user:       { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

type UserRow = {
  id:         string;
  email:      string;
  role:       string;
  created_at: string;
  last_sign_in_at: string | null;
};

async function getUsers(): Promise<{ users: UserRow[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
    if (error) return { users: [], error: true };

    const ids = data.users.map((u: { id: string }) => u.id);
    const { data: profiles } = await admin
      .from("users")
      .select("id, role")
      .in("id", ids);

    const roleMap = Object.fromEntries(
      (profiles ?? []).map((p: { id: string; role: string }) => [p.id, p.role])
    );

    return {
      users: data.users.map((u: { id: string; email?: string; created_at: string; last_sign_in_at?: string | null }) => ({
        id:              u.id,
        email:           u.email ?? "(no email)",
        role:            roleMap[u.id] ?? "user",
        created_at:      u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      })),
      error: false,
    };
  } catch {
    return { users: [], error: true };
  }
}

export default async function ManageUsersPage() {
  const { users, error } = await getUsers();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Users
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Users
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {error ? "Could not load users — check Supabase configuration." : `${users.length} registered account${users.length !== 1 ? "s" : ""}.`}
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <div className="text-sm" style={{ color: "#9CA3AF" }}>
            <p className="font-medium mb-1" style={{ color: "#F9FAFB" }}>Supabase not configured</p>
            <p>Add <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables and run the database migration to enable user management.</p>
          </div>
        </div>
      )}

      {!error && users.length === 0 && (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "#2563EB" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "#F9FAFB" }}>No users yet</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Users will appear here when they sign up on the platform.
          </p>
        </div>
      )}

      {!error && users.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          {/* Head */}
          <div
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#4B5563" }}
          >
            <span>Email</span>
            <span>Role</span>
            <span className="hidden md:block">Last sign in</span>
            <span>Joined</span>
          </div>

          <div style={{ backgroundColor: "#0F172A" }}>
            {users.map((user, i) => {
              const roleStyle = ROLE_COLORS[user.role] ?? ROLE_COLORS.user;
              return (
                <div
                  key={user.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3.5 border-b last:border-0"
                  style={{ borderColor: "#1E293B", backgroundColor: i % 2 === 0 ? "#0F172A" : "#0A1120" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: "#F9FAFB" }}>{user.email}</p>
                    <p className="text-[10px] font-mono mt-0.5 truncate" style={{ color: "#374151" }}>
                      {user.id}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                  >
                    {user.role === "admin" && <Shield className="h-3 w-3" />}
                    {user.role}
                  </span>
                  <span className="hidden md:block text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                    {user.last_sign_in_at
                      ? format(new Date(user.last_sign_in_at), "MMM d, yyyy")
                      : "Never"}
                  </span>
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
