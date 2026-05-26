import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

const MAX_BYTES   = 2 * 1024 * 1024;
const BUCKET_NAME = "avatars";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();
    const file     = formData.get("avatar") as File | null;

    if (!file)                          return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!file.type.startsWith("image/"))return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    if (file.size > MAX_BYTES)          return NextResponse.json({ error: "Image must be 2 MB or smaller" }, { status: 400 });

    const admin = createSupabaseAdminClient();

    // Ensure the bucket exists (public, no auth required to read)
    await admin.storage.createBucket(BUCKET_NAME, { public: true }).catch(() => {});

    const ext    = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path   = `${user.id}.${ext}`;
    const bytes  = await file.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(path, bytes, { contentType: file.type, upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    // Build versioned URL to bust browser/CDN cache after re-upload
    const { data: { publicUrl } } = admin.storage.from(BUCKET_NAME).getPublicUrl(path);
    const versionedUrl = `${publicUrl}?v=${Date.now()}`;

    // Sync to both public.users and auth user_metadata
    await admin
      .from("users")
      .update({ avatar_url: versionedUrl })
      .eq("id", user.id);

    await supabase.auth.updateUser({ data: { avatar_url: versionedUrl } });

    return NextResponse.json({ ok: true, avatar_url: versionedUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
