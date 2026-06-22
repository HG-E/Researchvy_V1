import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

async function getCallerAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// PATCH — upsert article metadata overrides and revalidate public pages
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  const {
    title, excerpt, featured_image, body_md,
    category, tags, reading_time, published_at, is_published,
  } = body as {
    title?:          string | null;
    excerpt?:        string | null;
    featured_image?: string | null;
    body_md?:        string | null;
    category?:       string | null;
    tags?:           string[] | null;
    reading_time?:   number | null;
    published_at?:   string | null;
    is_published?:   boolean;
  };

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("article_meta")
    .upsert(
      {
        slug,
        title:          title          ?? null,
        excerpt:        excerpt         ?? null,
        featured_image: featured_image  ?? null,
        body_md:        body_md         ?? null,
        category:       category        ?? null,
        tags:           tags            ?? null,
        reading_time:   reading_time    ?? null,
        published_at:   published_at    ?? null,
        is_published:   is_published    ?? true,
        updated_at:     new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

  if (error) {
    console.error("[admin/articles]", error.message);
    return NextResponse.json({ error: "Failed to save article metadata" }, { status: 500 });
  }

  // Immediately invalidate the static article page and the insights list
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/insights");

  return NextResponse.json({ ok: true });
}
