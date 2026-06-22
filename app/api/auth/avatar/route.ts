import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const MAX_BYTES   = 2 * 1024 * 1024;
const BUCKET_NAME = "avatars";

// Magic byte signatures for allowed image formats.
// Validates actual file content — cannot be spoofed via Content-Type header alone.
function detectImageType(buf: ArrayBuffer): "image/jpeg" | "image/png" | "image/webp" | null {
  const b = new Uint8Array(buf, 0, 12);
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  // WebP: RIFF????WEBP
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    // 10 avatar uploads per IP per hour — prevents storage spam
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "avatar-upload"), 10, 60 * 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();
    const file     = formData.get("avatar") as File | null;

    if (!file)               return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be 2 MB or smaller" }, { status: 400 });

    const bytes    = await file.arrayBuffer();
    const mimeType = detectImageType(bytes);

    if (!mimeType) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    // Ensure the bucket exists (public, no auth required to read)
    await admin.storage.createBucket(BUCKET_NAME, { public: true }).catch(() => {});

    const ext  = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(path, bytes, { contentType: mimeType, upsert: true });

    if (uploadError) {
      console.error("[avatar/upload]", uploadError.message);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }

    // Build versioned URL to bust browser/CDN cache after re-upload
    const { data: { publicUrl } } = admin.storage.from(BUCKET_NAME).getPublicUrl(path);
    const versionedUrl = `${publicUrl}?v=${Date.now()}`;

    // Sync to both public.users and auth user_metadata
    await admin.from("users").update({ avatar_url: versionedUrl }).eq("id", user.id);
    await supabase.auth.updateUser({ data: { avatar_url: versionedUrl } });

    return NextResponse.json({ ok: true, avatar_url: versionedUrl });
  } catch (e: unknown) {
    console.error("[avatar/upload]", e);
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
