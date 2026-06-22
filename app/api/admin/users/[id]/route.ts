import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole, isSuperAdmin } from "@/lib/auth/permissions";

async function getCallerAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

function adminErr(msg: string, raw: unknown, status = 500): NextResponse {
  console.error("[admin/users]", msg, raw);
  return NextResponse.json({ error: msg }, { status });
}

// PATCH — suspend | unsuspend | flag | unflag | set_role | verify
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const callerIsSuper = isSuperAdmin(caller.email);
  const { id: targetId } = await params;
  const body = await req.json().catch(() => ({}));
  const { action, role, reason } = body as {
    action: "suspend" | "unsuspend" | "flag" | "unflag" | "set_role" | "verify";
    role?:   string;
    reason?: string;
  };

  const admin = createSupabaseAdminClient();

  // Fetch target user to enforce super-admin protection
  const { data: targetData } = await admin.auth.admin.getUserById(targetId);
  const targetEmail = targetData?.user?.email ?? "";
  const targetIsSuper = isSuperAdmin(targetEmail);

  // Regular admins cannot touch the super admin account
  if (targetIsSuper && !callerIsSuper) {
    return NextResponse.json({ error: "Cannot modify the platform owner account." }, { status: 403 });
  }

  // Only super admin can assign admin role
  if (action === "set_role" && role === "admin" && !callerIsSuper) {
    return NextResponse.json({ error: "Only the platform owner can assign admin roles." }, { status: 403 });
  }

  if (action === "suspend") {
    const { error } = await admin.auth.admin.updateUserById(targetId, { ban_duration: "876000h" });
    if (error) return adminErr("Failed to suspend user", error.message);
  }

  else if (action === "unsuspend") {
    const { error } = await admin.auth.admin.updateUserById(targetId, { ban_duration: "none" });
    if (error) return adminErr("Failed to unsuspend user", error.message);
  }

  else if (action === "flag") {
    const prevMeta = targetData?.user?.user_metadata ?? {};
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      user_metadata: {
        ...prevMeta,
        flagged:        true,
        flagged_reason: reason ?? "Flagged by admin",
        flagged_at:     new Date().toISOString(),
        flagged_by:     caller.email,
      },
    });
    if (error) return adminErr("Failed to flag user", error.message);
  }

  else if (action === "unflag") {
    const { flagged: _f, flagged_reason: _r, flagged_at: _a, flagged_by: _b, ...rest } =
      targetData?.user?.user_metadata ?? {};
    const { error } = await admin.auth.admin.updateUserById(targetId, { user_metadata: rest });
    if (error) return adminErr("Failed to unflag user", error.message);
  }

  else if (action === "set_role") {
    const validRoles = ["user", "researcher", "partner", "admin"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const { error } = await admin.from("users").update({ role }).eq("id", targetId);
    if (error) return adminErr("Failed to update role", error.message);
  }

  else if (action === "verify") {
    const { error } = await admin.auth.admin.updateUserById(targetId, { email_confirm: true });
    if (error) return adminErr("Failed to verify user", error.message);
  }

  else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — permanently remove user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: targetId } = await params;

  if (targetId === caller.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: targetData } = await admin.auth.admin.getUserById(targetId);
  const targetEmail = targetData?.user?.email ?? "";

  if (isSuperAdmin(targetEmail) && !isSuperAdmin(caller.email)) {
    return NextResponse.json({ error: "Cannot delete the platform owner account." }, { status: 403 });
  }

  const { error } = await admin.auth.admin.deleteUser(targetId);
  if (error) return adminErr("Failed to delete user", error.message);

  return NextResponse.json({ ok: true });
}
