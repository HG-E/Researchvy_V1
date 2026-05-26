import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

const SETUP_SECRET = process.env.SETUP_ADMIN_SECRET ?? "";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!SETUP_SECRET || secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createSupabaseAdminClient();
  const email = "researchvy@gmail.com";
  const password = req.nextUrl.searchParams.get("password") ?? "";

  if (password.length < 8) {
    return NextResponse.json({ error: "password query param required (min 8 chars)" }, { status: 400 });
  }

  // Check if user already exists
  const { data: existing } = await db
    .from("users")
    .select("id, email, role")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    // Just promote to admin
    await db.from("users").update({ role: "admin" }).eq("email", email);
    return NextResponse.json({ ok: true, action: "promoted", email, role: "admin" });
  }

  // Create auth user via admin API
  const { data: authUser, error: authErr } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Researchvy Admin" },
  });

  if (authErr || !authUser.user) {
    return NextResponse.json({ error: authErr?.message ?? "Failed to create auth user" }, { status: 500 });
  }

  // Set admin role in public.users (trigger may have already inserted the row)
  await new Promise((r) => setTimeout(r, 800));
  const { error: roleErr } = await db
    .from("users")
    .update({ role: "admin", full_name: "Researchvy Admin" })
    .eq("id", authUser.user.id);

  if (roleErr) {
    return NextResponse.json({
      ok: true,
      action: "created",
      warning: "Auth user created but role update failed — run SQL manually",
      sql: `UPDATE public.users SET role = 'admin' WHERE email = '${email}';`,
    });
  }

  return NextResponse.json({
    ok: true,
    action: "created",
    email,
    role: "admin",
    message: "Admin account created. You can now sign in at /signin",
  });
}
