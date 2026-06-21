import { createSupabaseAdminClient } from "@/lib/auth/supabase";

/**
 * Derives a URL-safe slug from a full name, then appends a numeric suffix
 * until the slug is unique in the DB. Returns the final available username.
 * Example: "Dr. Jane Researcher" → "jane-researcher" (or "jane-researcher2" if taken)
 */
export async function generateUniqueUsername(fullName: string): Promise<string> {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 18);

  const candidate = base.length >= 3 ? base : `user-${base}`.slice(0, 20);
  const admin = createSupabaseAdminClient();

  for (let i = 0; i <= 999; i++) {
    const attempt = i === 0 ? candidate : `${candidate.slice(0, 17)}${i}`;
    const { data } = await admin
      .from("users")
      .select("id")
      .eq("username", attempt)
      .maybeSingle();
    if (!data) return attempt;
  }

  return `user-${Date.now().toString(36).slice(-8)}`;
}
