import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

// POST /api/leads — capture an email lead from the insights page
export async function POST(req: NextRequest) {
  try {
    // 3 lead captures per hour per IP — prevent abuse
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "lead"), 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { email, first_name, article_title } = await req.json() as {
      email:         string;
      first_name:    string;
      article_title?: string;
    };

    if (!email || !first_name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // Fire and forget — email utility handles admin notification + lead nurture email
    import("@/lib/email").then(({ sendLeadMagnetEmail }) =>
      sendLeadMagnetEmail({
        to:           email,
        firstName:    first_name,
        articleTitle: article_title,
      }).catch(console.error)
    ).catch(console.error);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
