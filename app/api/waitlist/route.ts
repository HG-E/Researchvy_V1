import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { sendWaitlistConfirmationEmail } from "@/lib/email";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  try {
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "waitlist"), 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { name, email, clinicSlug = "digital-visibility-clinic" } = await req.json() as {
      name:       string;
      email:      string;
      clinicSlug?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    await supabase
      .from("clinic_waitlist")
      .upsert(
        { name: name.trim(), email: email.toLowerCase().trim(), clinic_slug: clinicSlug },
        { onConflict: "email,clinic_slug", ignoreDuplicates: true },
      );

    sendWaitlistConfirmationEmail({ to: email, firstName: name.trim().split(" ")[0] })
      .catch(console.error);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[waitlist] error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
