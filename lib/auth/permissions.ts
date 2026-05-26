import type { UserRole } from "@/types";

/** Hierarchy — higher index = more access */
const ROLE_LEVELS: Record<UserRole, number> = {
  user:       0,
  researcher: 1,
  partner:    2,
  admin:      3,
};

/** Returns true if the user's role meets the required minimum level. */
export function hasRole(userRole: UserRole, required: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[required];
}

export const isAdmin      = (role: UserRole) => hasRole(role, "admin");
export const isPartner    = (role: UserRole) => hasRole(role, "partner");
export const isResearcher = (role: UserRole) => hasRole(role, "researcher");

/**
 * Super admin is designated by SUPER_ADMIN_EMAIL env var.
 * No DB role change needed — email match grants full platform ownership.
 * Only the super admin can assign/revoke admin roles.
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  const sa = process.env.SUPER_ADMIN_EMAIL;
  return !!sa && !!email && email.toLowerCase() === sa.toLowerCase();
}

/**
 * Server-side role check — reads the user profile from the DB.
 * Use in Route Handlers or Server Actions that need role enforcement.
 */
export async function requireRole(
  userId: string,
  required: UserRole
): Promise<{ allowed: boolean; role: UserRole | null }> {
  try {
    const { createSupabaseAdminClient } = await import("./supabase");
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) return { allowed: false, role: null };
    const role = data.role as UserRole;
    return { allowed: hasRole(role, required), role };
  } catch {
    return { allowed: false, role: null };
  }
}
