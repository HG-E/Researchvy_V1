import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { Resend } from "resend";
import { certificateIssuedEmail } from "@/lib/email/templates";
import { getProgramme } from "@/lib/certificates/programmes";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── POST — issue a certificate (admin only) ───────────────────────────────────

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify caller is admin
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { recipient_name, recipient_email, user_id, enquiry_id, clinic_slug } = body;

  if (!recipient_name || !recipient_email) {
    return NextResponse.json(
      { error: "recipient_name and recipient_email are required" },
      { status: 400 }
    );
  }

  // Guard: don't double-issue for the same enquiry
  if (enquiry_id) {
    const { data: existing } = await admin
      .from("certificates")
      .select("id, certificate_number")
      .eq("enquiry_id", enquiry_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Certificate already issued for this enquiry", certificate: existing },
        { status: 409 }
      );
    }
  }

  // Resolve programme config — drives the certificate code and formal type name
  const prog = getProgramme(clinic_slug ?? "digital-visibility-clinic");
  const year = new Date().getFullYear().toString();

  // Count existing certs for this programme code in the current year to get next sequence
  const { count } = await admin
    .from("certificates")
    .select("*", { count: "exact", head: true })
    .like("certificate_number", `${prog.code}-${year}-%`);

  const seq = (count ?? 0) + 1;
  const certificate_number = `${prog.code}-${year}-${String(seq).padStart(5, "0")}`;

  const { data: cert, error } = await admin
    .from("certificates")
    .insert({
      certificate_number,
      user_id:         user_id ?? null,
      enquiry_id:      enquiry_id ?? null,
      recipient_name,
      recipient_email,
      programme:       prog.certificateType,
      clinic_slug:     clinic_slug ?? "digital-visibility-clinic",
      issued_by:       user.email,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send certificate email to recipient (non-blocking)
  const { subject, html } = certificateIssuedEmail(
    recipient_name,
    certificate_number,
    prog.displayName
  );
  resend.emails.send({
    from:    "Researchvy <info@researchvy.com>",
    to:      [recipient_email],
    subject,
    html,
  }).catch((e) => console.error("[certificates] email error:", e));

  return NextResponse.json({ ok: true, certificate: cert });
}

// ── GET — verify a certificate by number (public) ────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.toUpperCase().trim();

  if (!number) {
    return NextResponse.json({ error: "number is required" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("certificates")
    .select("certificate_number, recipient_name, programme, issued_at, clinic_slug")
    .eq("certificate_number", number)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json({ valid: true, certificate: data });
}
