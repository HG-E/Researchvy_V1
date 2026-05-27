import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// PATCH — batch update positions for modules or lessons
// Body: { type: "module" | "lesson", items: [{id: string, position: number}] }
export async function PATCH(req: NextRequest) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { type, items } = await req.json() as {
    type: "module" | "lesson";
    items: { id: string; position: number }[];
  };

  if (!type || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "type and items are required" }, { status: 400 });
  }

  const table = type === "module" ? "modules" : "lessons";
  const admin = createSupabaseAdminClient();

  // Update each item's position in parallel
  await Promise.all(
    items.map(({ id, position }) =>
      admin.from(table).update({ position }).eq("id", id)
    )
  );

  return NextResponse.json({ ok: true });
}
