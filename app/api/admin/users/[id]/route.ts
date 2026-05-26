import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function getCallerAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// PATCH — suspend | unsuspend | flag | unflag | set_role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: targetId } = await params;
  const body = await req.json().catch(() => ({}));
  const { action, role, reason } = body as {
    action: "suspend" | "unsuspend" | "flag" | "unflag" | "set_role";
    role?:   string;
    reason?: string;
  };

  const admin = createSupabaseAdminClient();

  if (action === "suspend") {
    // 100 years = effectively permanent until manually lifted
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: "876000h",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  else if (action === "unsuspend") {
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: "none",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  else if (action === "flag") {
    const { data: existing } = await admin.auth.admin.getUserById(targetId);
    const prevMeta = existing?.user?.user_metadata ?? {};
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      user_metadata: {
        ...prevMeta,
        flagged:        true,
        flagged_reason: reason ?? "Flagged by admin",
        flagged_at:     new Date().toISOString(),
        flagged_by:     caller.email,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  else if (action === "unflag") {
    const { data: existing } = await admin.auth.admin.getUserById(targetId);
    const { flagged: _f, flagged_reason: _r, flagged_at: _a, flagged_by: _b, ...rest } =
      existing?.user?.user_metadata ?? {};
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      user_metadata: rest,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  else if (action === "set_role") {
    const validRoles = ["user", "researcher", "partner", "admin"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const { error } = await admin.from("users").update({ role }).eq("id", targetId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — permanently remove user (cascades to public.users via FK)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: targetId } = await params;

  // Prevent self-deletion
  if (targetId === caller.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(targetId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
