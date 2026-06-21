import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { usernameSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

// GET /api/users/username/check?q=jane-smith
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { allowed } = await checkRateLimit(getRateLimitKey(req, "username-check"), 30, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const q = (req.nextUrl.searchParams.get("q") ?? "").toLowerCase();

  const parsed = usernameSchema.safeParse(q);
  if (!parsed.success) {
    return NextResponse.json({ available: false, error: parsed.error.errors[0].message });
  }

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("users")
    .select("id")
    .eq("username", q)
    .neq("id", user.id)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
