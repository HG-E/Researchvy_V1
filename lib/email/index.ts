// Central email utility. All transactional emails go through this module.
// Uses Resend (free tier: 3,000/month). Fire-and-forget on the server — never
// await these in critical paths; they must never break user-facing flows.

import { digitalVisibilityClinic } from "@/constants/clinics";
import { PRE_CLINIC_SESSIONS } from "@/constants/preClinic";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";

const FROM_ACADEMY = "Researchvy Academy <info@researchvy.com>";
const FROM_TEAM    = "Researchvy Team <info@researchvy.com>";
const REPLY_TO     = "info@researchvy.com";
const ADMIN_CC     = "researchvy@gmail.com";
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com";

async function resend() {
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

/** Escape user-supplied text before interpolating into an HTML email body. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Welcome (on signup) ───────────────────────────────────────────────────────

export async function sendWelcomeEmail(opts: {
  to:        string;
  firstName: string;
}) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `Welcome to Researchvy, ${opts.firstName} 👋`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <h1 style="color:#F9FAFB;font-size:26px;font-weight:700;margin:0 0 16px;line-height:1.3">
      Your path to global scholarly visibility starts here.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Hi ${opts.firstName},<br><br>
      Welcome to Researchvy — the platform built for researchers who want their work
      to be discovered, cited, and recognised globally.<br><br>
      You've just joined thousands of researchers transforming how the world finds
      and reads their work.
    </p>

    <div style="border-left:3px solid #10B981;padding-left:16px;margin-bottom:24px">
      <p style="color:#34D399;font-size:13px;font-weight:600;margin:0 0 8px">Your first three steps:</p>
      <ol style="color:#9CA3AF;font-size:14px;line-height:1.9;margin:0;padding-left:20px">
        <li><strong style="color:#D1D5DB">Take the free Visibility Scorecard</strong> — 12 checkpoints, 5 minutes, your exact score across all four dimensions</li>
        <li>Complete your researcher profile — add your ORCID and institution</li>
        <li>Explore the free Academy courses — practical skills at every career stage</li>
      </ol>
    </div>

    <a href="${SITE_URL}/resources/visibility-scorecard"
       style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:12px">
      Take the Scorecard Free →
    </a>
    <br>
    <a href="${SITE_URL}/dashboard"
       style="display:inline-block;color:#6B7280;text-decoration:none;font-size:13px;padding:8px 0">
      Or go to your dashboard →
    </a>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:32px">
    <p style="color:#6B7280;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px">
      Why it matters
    </p>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0">
      Most researchers publish excellent work that almost nobody reads.
      Not because the work isn't good — because it isn't <strong style="color:#D1D5DB">findable</strong>.
      Researchvy closes that gap.
    </p>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Researchvy · Making researchers discoverable, globally.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">researchvy.com</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/insights" style="color:#4B5563;text-decoration:none">Insights</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/academy/courses" style="color:#4B5563;text-decoration:none">Academy</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Enrollment welcome (when admin enrolls a researcher) ──────────────────────

export async function sendEnrollmentWelcomeEmail(opts: {
  to:           string;
  firstName:    string;
  courseName:   string;
  courseSlug:   string;
  courseLevel:  number;
  firstLessonId?: string;
}) {
  const LEVEL_COLORS = ["#60A5FA", "#A78BFA", "#34D399", "#FCD34D", "#F472B6"];
  const color        = LEVEL_COLORS[Math.min(opts.courseLevel - 1, 4)];
  const courseUrl    = `${SITE_URL}/academy/courses/${opts.courseSlug}`;
  const startUrl     = opts.firstLessonId
    ? `${SITE_URL}/academy/courses/${opts.courseSlug}/lessons/${opts.firstLessonId}`
    : courseUrl;

  const r = await resend();
  await r.emails.send({
    from:    FROM_ACADEMY,
    to:      [opts.to],
    cc:      [ADMIN_CC],
    replyTo: REPLY_TO,
    subject: `You're enrolled in "${opts.courseName}" — Researchvy Academy`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy Academy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-top:3px solid ${color};border-radius:20px;padding:40px;margin-bottom:32px;text-align:center">
    <div style="font-size:48px;margin-bottom:16px">🎓</div>
    <span style="background:${color}18;color:${color};border:1px solid ${color}30;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px;display:inline-block;margin-bottom:20px">
      Level ${opts.courseLevel} Enrolled
    </span>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 8px;line-height:1.3">
      You're in, ${opts.firstName}.
    </h1>
    <p style="color:#6B7280;font-size:15px;margin:0 0 24px">
      Your access to <strong style="color:#D1D5DB">${opts.courseName}</strong> is now active.
    </p>
    <a href="${startUrl}"
       style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 36px;border-radius:12px;margin-bottom:16px">
      Start your first lesson →
    </a>
    <p style="color:#4B5563;font-size:12px;margin:0">
      Or <a href="${courseUrl}" style="color:#6B7280;text-decoration:underline">view the full course curriculum</a>
    </p>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#6B7280;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">
      What to expect
    </p>
    <ul style="list-style:none;margin:0;padding:0">
      ${[
        "Self-paced lessons — work at your own schedule",
        "Mark each lesson complete to track your progress",
        "Earn a certificate when you finish the course",
        "Access your next level the moment you're ready",
      ].map((point) => `
      <li style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;color:#9CA3AF;font-size:14px;line-height:1.6">
        <span style="color:${color};font-weight:700;flex-shrink:0">✓</span>
        ${point}
      </li>`).join("")}
    </ul>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Questions? Reply to this email — we read every one.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/dashboard" style="color:#4B5563;text-decoration:none">Your Dashboard</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Day-2 drip (platform re-engagement) ──────────────────────────────────────

export async function sendDay2DripEmail(opts: { to: string; firstName: string }) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `${opts.firstName}, do you know your actual visibility score?`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4">
      Hi ${opts.firstName} — most researchers score between 25 and 45.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      The Researcher Visibility Scorecard takes 5 minutes and gives you an exact score
      across 12 checkpoints — Scholar Identity, Discoverability, Citation Health,
      and Research Communication.
    </p>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Most researchers are surprised by how many fixable gaps they find. Each checkpoint
      shows you exactly what the gap is costing you — and the fastest way to close it.
    </p>
    <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#10B981;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px">Free Diagnostic Tool</p>
      <p style="color:#E2E8F0;font-size:15px;font-weight:600;margin:0 0 4px">Researcher Visibility Scorecard</p>
      <p style="color:#6B7280;font-size:13px;margin:0">12 checkpoints · 5 minutes · Results shown immediately</p>
    </div>
    <a href="${SITE_URL}/resources/visibility-scorecard"
       style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px">
      Check My Score Free →
    </a>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/resources/visibility-scorecard" style="color:#4B5563;text-decoration:none">Visibility Scorecard</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Day-5 drip (scorecard nudge + academy as deepening path) ─────────────────

export async function sendDay5DripEmail(opts: { to: string; firstName: string }) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `${opts.firstName}, where do you actually stand?`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:24px">
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4">
      Here's what separates cited researchers from invisible ones.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      It's not prestige. It's not luck. It's a small set of learnable skills
      that most researchers were never taught in their PhD programme.
    </p>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Before you learn the skills, though — you need to know <em>which</em> ones matter most for you.
      Most researchers who fix the wrong thing first spend months on platforms that don't move their numbers.
    </p>
    <div style="background:#0A2118;border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:24px;margin-bottom:28px">
      <p style="color:#10B981;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">
        The Researcher Visibility Scorecard
      </p>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.8;margin:0 0 12px">
        12 checkpoints. 4–6 minutes. Your score out of 100, with a breakdown of exactly where your visibility is leaking and what to fix first.
      </p>
      <p style="color:#6B7280;font-size:13px;margin:0">
        Scholar Identity · Discoverability · Citation Health · Research Communication
      </p>
    </div>
    <a href="${SITE_URL}/resources/visibility-scorecard"
       style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:12px">
      Check My Visibility Score Free →
    </a>
    <p style="color:#4B5563;font-size:12px;margin:8px 0 0">
      Free · No payment required · Results shown instantly
    </p>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#A78BFA;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">
      Then go deeper with the Academy
    </p>
    <p style="color:#9CA3AF;font-size:13px;line-height:1.7;margin:0 0 14px">
      Once you know your score, the Academy courses show you exactly how to fix each gap —
      discoverable profiles, citation-worthy abstracts, research communication that travels.
      Several courses are free.
    </p>
    <a href="${SITE_URL}/academy/courses"
       style="color:#A78BFA;text-decoration:none;font-weight:600;font-size:13px">
      Explore Academy courses →
    </a>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#6B7280;font-size:13px;line-height:1.7;margin:0">
      Questions about your visibility strategy? Reply to this email — we read every one.
    </p>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/resources/visibility-scorecard" style="color:#4B5563;text-decoration:none">Visibility Scorecard</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/academy/courses" style="color:#4B5563;text-decoration:none">Academy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/clinics" style="color:#4B5563;text-decoration:none">Clinics</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Lead magnet (insights email capture) ─────────────────────────────────────

export async function sendLeadMagnetEmail(opts: {
  to:        string;
  firstName: string;
  articleTitle?: string;
}) {
  const r = await resend();

  // Notify admin of new lead
  r.emails.send({
    from:    FROM_TEAM,
    to:      [ADMIN_CC],
    subject: `New lead: ${opts.to}${opts.articleTitle ? ` from "${opts.articleTitle}"` : ""}`,
    html: `<p>New lead captured:<br><strong>${opts.firstName}</strong> — ${opts.to}</p>
           ${opts.articleTitle ? `<p>Source article: ${opts.articleTitle}</p>` : ""}`,
  }).catch(() => {});

  // Value email to the lead
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `Your Researcher Visibility Guide — Researchvy`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">
      Hi ${opts.firstName}, here's what every discoverable researcher knows.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Most research goes unread — not because it isn't good, but because it isn't
      <em>findable</em>. The researchers who get cited, quoted, and invited to speak
      aren't always the best scientists. They're the most <strong style="color:#D1D5DB">visible</strong> ones.
    </p>

    <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:24px">
      <p style="color:#60A5FA;font-size:13px;font-weight:600;margin:0 0 8px">The 5 Visibility Levers:</p>
      <ol style="color:#9CA3AF;font-size:14px;line-height:2;margin:0;padding-left:20px">
        <li>Optimised ORCID + Google Scholar profile</li>
        <li>Strategic keyword alignment in abstracts</li>
        <li>Consistent cross-platform scholarly identity</li>
        <li>Preprint presence on the right platforms</li>
        <li>Engagement with your field's top 20 cited papers</li>
      </ol>
    </div>

    <a href="${SITE_URL}/resources/visibility-scorecard"
       style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:12px">
      Take the free Visibility Scorecard →
    </a>
    <br>
    <a href="${SITE_URL}/academy/courses"
       style="display:inline-block;color:#6B7280;text-decoration:none;font-size:13px;padding:8px 0">
      Or explore the free Academy courses →
    </a>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Researchvy · Making researchers discoverable, globally.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">researchvy.com</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Order submitted — admin alert ────────────────────────────────────────────

export async function sendOrderSubmittedAdminAlert(opts: {
  orderNumber:  string;
  userName:     string;
  userEmail:    string;
  userPhone:    string | null;
  bundleName:   string;
  currency:     "ngn" | "usd";
  amount:       number;
  reference:    string;
  submittedRef: string | null;
  orderId:      string;
}) {
  const amt      = opts.currency === "ngn" ? `₦${opts.amount.toLocaleString("en-NG")}` : `$${opts.amount} USD`;
  const confirmUrl = `${SITE_URL}/admin/orders`;

  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [ADMIN_CC],
    replyTo: REPLY_TO,
    subject: `[Action needed] Payment submitted — ${opts.orderNumber} · ${amt}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">

  <div style="background:#0F172A;border-radius:16px;overflow:hidden;margin-bottom:20px">
    <div style="height:4px;background:linear-gradient(90deg,#6366F1,#10B981)"></div>
    <div style="padding:28px 28px 24px">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6366F1">
        Action Required
      </p>
      <h1 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#F9FAFB">Payment submitted — verify &amp; confirm</h1>
      <p style="margin:0;font-size:13px;color:#9CA3AF">A customer has notified you that they've made a bank transfer.</p>
    </div>
  </div>

  <div style="background:#ffffff;border-radius:12px;padding:24px 28px;margin-bottom:16px">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["Order",        opts.orderNumber],
        ["Customer",     opts.userName],
        ["Email",        opts.userEmail],
        ...(opts.userPhone ? [["Phone", opts.userPhone]] : []),
        ["Bundle",       opts.bundleName],
        ["Amount",       amt],
        ["Our reference", opts.reference],
        ...(opts.submittedRef ? [["Their bank ref", opts.submittedRef]] : [["Their bank ref", "(not provided)"]]),
      ].map(([label, value]) => `
      <tr>
        <td style="padding:7px 0;font-size:12px;color:#9CA3AF;border-bottom:1px solid #F3F4F6;width:40%">${label}</td>
        <td style="padding:7px 0;font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #F3F4F6">${value}</td>
      </tr>`).join("")}
    </table>
  </div>

  <div style="text-align:center;margin-bottom:20px">
    <a href="${confirmUrl}"
       style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px">
      Go to Orders → Confirm
    </a>
  </div>

  <p style="text-align:center;font-size:11px;color:#9CA3AF;margin:0">
    Researchvy admin · Reply to this email to contact the customer directly.
  </p>

</div>
</body>
</html>`,
  });
}

// ── Order submitted — customer acknowledgement ────────────────────────────────

export async function sendPaymentReceivedEmail(opts: {
  to:           string;
  userName:     string;
  orderNumber:  string;
  bundleName:   string;
  currency:     "ngn" | "usd";
  amount:       number;
  reference:    string;
  submittedRef: string | null;
}) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;
  const amt       = opts.currency === "ngn" ? `₦${opts.amount.toLocaleString("en-NG")}` : `$${opts.amount} USD`;

  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `We've received your payment notification — ${opts.orderNumber}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 20px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;overflow:hidden;margin-bottom:24px">
    <div style="height:4px;background:linear-gradient(90deg,#2563EB,#10B981)"></div>
    <div style="padding:32px 28px">
      <div style="font-size:36px;margin-bottom:12px;text-align:center">⏳</div>
      <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;line-height:1.3">
        Got it, ${firstName}. We're verifying your transfer.
      </h1>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0;text-align:center">
        Our team will confirm your enrollment within <strong style="color:#D1D5DB">2 business hours</strong>.
        You'll get another email the moment it's done.
      </p>
    </div>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px 28px;margin-bottom:24px">
    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B5563">
      Your submission summary
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["Order number",  opts.orderNumber],
        ["Programme",     "Digital Visibility Clinic — August 2026"],
        ["Bundle",        opts.bundleName],
        ["Amount",        amt],
        ["Your reference", opts.reference],
        ...(opts.submittedRef ? [["Bank transaction ID", opts.submittedRef]] : []),
      ].map(([label, value]) => `
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#6B7280;border-bottom:1px solid #1E293B;width:45%">${label}</td>
        <td style="padding:6px 0;font-size:12px;font-weight:600;color:#D1D5DB;border-bottom:1px solid #1E293B">${value}</td>
      </tr>`).join("")}
    </table>
  </div>

  <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
    <p style="margin:0;font-size:13px;color:#D97706;line-height:1.7">
      <strong>Didn't make the transfer yet?</strong> No problem — this email is just confirmation that we received your notification.
      Your enrollment is only confirmed once our team verifies the payment.
    </p>
  </div>

  <div style="text-align:center;padding-top:20px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Questions? Reply to this email — we read every one.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Order confirmed / enrollment receipt ──────────────────────────────────────

export async function sendOrderConfirmedEmail(opts: {
  to:          string;
  userName:    string;
  orderNumber: string;
  bundleId:    string;
  moduleId:    string | null;
  currency:    "ngn" | "usd";
  amount:      number;
}) {
  const { sessions, pricing } = digitalVisibilityClinic;

  function bundleLabel(): string {
    if (opts.bundleId === "solo" && opts.moduleId) {
      const s = sessions.find((x) => x.id === opts.moduleId);
      return s ? `${s.name} — Single Module` : "Single Module";
    }
    return pricing.bundles.find((b) => b.id === opts.bundleId)?.name ?? opts.bundleId;
  }

  function formatAmount(): string {
    return opts.currency === "ngn"
      ? `₦${opts.amount.toLocaleString("en-NG")}`
      : `$${opts.amount} USD`;
  }

  const firstName  = opts.userName.split(" ")[0] || opts.userName;
  const bundleName = bundleLabel();
  const amountStr  = formatAmount();
  const cohortUrl  = `${SITE_URL}/dashboard/clinics`;

  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    cc:      [ADMIN_CC],
    replyTo: REPLY_TO,
    subject: `You're in — DVC August 2026 enrollment confirmed (${opts.orderNumber})`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">

  <div style="background:#0F172A;border-radius:20px;overflow:hidden;margin-bottom:24px;">
    <div style="height:4px;background:linear-gradient(90deg,#2563EB,#10B981);"></div>
    <div style="padding:40px 32px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#2563EB;">
        Digital Visibility Clinic · August 2026
      </p>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;line-height:1.3;color:#F9FAFB;">
        You're enrolled, ${firstName}.
      </h1>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#9CA3AF;">
        Payment confirmed. Your place in the August 2026 cohort is secured.
      </p>
    </div>
  </div>

  <div style="background:#ffffff;border-radius:16px;padding:28px 32px;margin-bottom:20px;">
    <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6B7280;">
      Order Receipt
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["Order Number", opts.orderNumber],
        ["Programme",    "Digital Visibility Clinic"],
        ["Bundle",       bundleName],
        ["Cohort",       "August 2026"],
        ["Amount paid",  amountStr],
      ].map(([label, value]) => `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#9CA3AF;border-bottom:1px solid #F3F4F6;">${label}</td>
        <td style="padding:8px 0;font-size:13px;font-weight:600;color:#111827;text-align:right;border-bottom:1px solid #F3F4F6;">${value}</td>
      </tr>`).join("")}
    </table>
  </div>

  <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:16px;padding:24px 32px;margin-bottom:20px;">
    <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#166534;">What happens next</p>
    <ol style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
      <li>Watch your inbox — cohort scheduling details will arrive within 48 hours.</li>
      <li>Join the WhatsApp community group (link coming in the cohort email).</li>
      <li>Log in to your dashboard to access your clinic tasks and resources.</li>
    </ol>
  </div>

  <div style="text-align:center;margin-bottom:24px;">
    <a href="${cohortUrl}"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;">
      Go to My Clinics Dashboard →
    </a>
  </div>

  <div style="border-top:1px solid #E5E7EB;padding-top:20px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.7;">
      Questions? Reply to this email or message us on WhatsApp.<br>
      Order ${opts.orderNumber} · <a href="${SITE_URL}" style="color:#6B7280;text-decoration:none;">researchvy.com</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Order cancelled ───────────────────────────────────────────────────────────

export async function sendOrderCancelledEmail(opts: {
  to:          string;
  userName:    string;
  orderNumber: string;
  reason:      string;
}) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;

  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `Re: your order ${opts.orderNumber} — important update`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 20px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:32px 28px;margin-bottom:24px">
    <h1 style="color:#F9FAFB;font-size:20px;font-weight:700;margin:0 0 12px;line-height:1.3">
      Hi ${firstName}, we couldn't verify your payment for order ${opts.orderNumber}.
    </h1>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 16px">
      Unfortunately we were unable to confirm a matching transfer for this order.
      ${opts.reason ? `<br><br><strong style="color:#D1D5DB">Reason:</strong> ${opts.reason}` : ""}
    </p>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0">
      <strong style="color:#D1D5DB">What to do:</strong> If you've already made the transfer, please reply to this email with your bank's transaction receipt and we'll resolve it immediately.
      If not, you're welcome to <a href="${SITE_URL}/clinics/checkout" style="color:#60A5FA;text-decoration:none">start a new order</a> when you're ready.
    </p>
  </div>

  <div style="text-align:center;padding-top:20px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Reply to this email to speak to our team.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Enrollment onboarding drip — shared opts type ─────────────────────────────

interface EnrollmentDripOpts {
  to:          string;
  userName:    string;
  bundleName:  string;
  orderNumber: string;
  cohortStart: string;
  whatsappUrl: string;
}

function dripShell(body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 20px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;text-align:center">Researchvy</p>
  ${body}
  <p style="text-align:center;font-size:12px;color:#374151;margin:20px 0 0">Reply to this email with any questions — we read every one.</p>
</div></body></html>`;
}

// ── Email 2: Cohort Prep (Day 1 after enrollment) ─────────────────────────────

export async function sendCohortPrepEmail(opts: EnrollmentDripOpts) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;
  const r = await resend();
  await r.emails.send({
    from: FROM_TEAM, to: [opts.to], replyTo: REPLY_TO,
    subject: `Your Digital Visibility Clinic starts ${opts.cohortStart} — here's how to prepare`,
    html: dripShell(`
      <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;overflow:hidden;margin-bottom:20px">
        <div style="height:4px;background:linear-gradient(90deg,#2563EB,#10B981)"></div>
        <div style="padding:32px 28px">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#2563EB">Cohort Preparation</p>
          <h1 style="color:#F9FAFB;font-size:21px;font-weight:700;margin:8px 0 12px">${firstName}, your cohort starts ${opts.cohortStart}.</h1>
          <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 20px">Here's what to do before your first session so you get the most out of every minute:</p>
          <ol style="color:#9CA3AF;font-size:13px;line-height:2.2;margin:0 0 24px;padding-left:20px">
            <li>Create or log in to your <strong style="color:#D1D5DB">ORCID account</strong> at orcid.org</li>
            <li>Open your <strong style="color:#D1D5DB">Google Scholar profile</strong> — note your current h-index</li>
            <li>Take a screenshot of your <strong style="color:#D1D5DB">Scopus / Web of Science</strong> citation count</li>
            <li>Write your <strong style="color:#D1D5DB">top 3 visibility goals</strong> — what do you most want to change?</li>
            <li>Log in to your <a href="${SITE_URL}/dashboard/clinics" style="color:#60A5FA">clinic dashboard</a> and complete your profile</li>
          </ol>
          <a href="${opts.whatsappUrl}" target="_blank"
             style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 24px;border-radius:10px">
            Join the Cohort WhatsApp Group →
          </a>
        </div>
      </div>`),
  });
}

// ── Email 3: Meet Your Cohort (Day 3) ─────────────────────────────────────────

export async function sendMeetYourCohortEmail(opts: EnrollmentDripOpts) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;
  const r = await resend();
  await r.emails.send({
    from: FROM_TEAM, to: [opts.to], replyTo: REPLY_TO,
    subject: `Meet your fellow researchers — DVC ${opts.cohortStart} cohort`,
    html: dripShell(`
      <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;overflow:hidden;margin-bottom:20px">
        <div style="height:4px;background:linear-gradient(90deg,#8B5CF6,#2563EB)"></div>
        <div style="padding:32px 28px">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8B5CF6">Your Cohort</p>
          <h1 style="color:#F9FAFB;font-size:21px;font-weight:700;margin:8px 0 12px">${firstName}, you're not doing this alone.</h1>
          <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 16px">
            Your cohort is a small group of researchers at a similar stage — your accountability partners, sounding board, and often, future collaborators.
          </p>
          <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 20px">
            <strong style="color:#D1D5DB">Before your first session</strong>, introduce yourself in the WhatsApp group:
          </p>
          <div style="background:#0A0F1A;border-radius:12px;padding:18px 22px;margin-bottom:24px">
            <p style="margin:0;font-size:13px;color:#C4B5FD;font-style:italic;line-height:1.7">
              "Hi, I'm Dr. [Your Name] from [Institution]. I work in [Field]. My biggest visibility challenge is [X]."
            </p>
          </div>
          <a href="${opts.whatsappUrl}" target="_blank"
             style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 24px;border-radius:10px">
            Introduce Yourself →
          </a>
        </div>
      </div>`),
  });
}

// ── Email 4: Session 1 Reminder (2 days before session) ──────────────────────

export async function sendSession1ReminderEmail(opts: EnrollmentDripOpts & { sessionTime: string; trackLabel: string }) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;
  const r = await resend();
  await r.emails.send({
    from: FROM_TEAM, to: [opts.to], replyTo: REPLY_TO,
    subject: `Session 1 is in 2 days — ${opts.sessionTime} (${opts.trackLabel} track)`,
    html: dripShell(`
      <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;overflow:hidden;margin-bottom:20px">
        <div style="height:4px;background:linear-gradient(90deg,#F59E0B,#EF4444)"></div>
        <div style="padding:32px 28px">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#F59E0B">Session 1 Reminder</p>
          <h1 style="color:#F9FAFB;font-size:21px;font-weight:700;margin:8px 0 12px">${firstName}, your first session is in 2 days.</h1>
          <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:14px 18px;margin-bottom:20px">
            <p style="margin:0;font-size:13px;color:#FCD34D;font-weight:700">${opts.sessionTime} · ${opts.trackLabel} Track</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9CA3AF">Session 1: Scholar Identity Architecture</p>
          </div>
          <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 16px">Have these open when the session starts:</p>
          <ul style="color:#9CA3AF;font-size:13px;line-height:2.2;margin:0 0 20px;padding-left:20px">
            <li>Your ORCID profile (orcid.org)</li>
            <li>Your Google Scholar profile</li>
            <li>Your institution's researcher profile (if any)</li>
          </ul>
          <p style="color:#6B7280;font-size:13px;margin:0 0 24px">The session link will be in the <strong style="color:#D1D5DB">WhatsApp group 30 min before</strong> it starts.</p>
          <a href="${SITE_URL}/dashboard/clinics"
             style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 24px;border-radius:10px">
            View Clinic Dashboard →
          </a>
        </div>
      </div>`),
  });
}

// ── Email 5: What to Prepare (morning of Session 1) ──────────────────────────

export async function sendWhatToPrepareEmail(opts: EnrollmentDripOpts & { sessionTime: string }) {
  const firstName = opts.userName.split(" ")[0] || opts.userName;
  const checks = [
    "Stable internet (WiFi recommended)",
    "ORCID profile open in a browser tab",
    "Google Scholar profile open",
    "Notebook or notes app ready",
    "Session link from the WhatsApp group saved",
  ];
  const r = await resend();
  await r.emails.send({
    from: FROM_TEAM, to: [opts.to], replyTo: REPLY_TO,
    subject: `Today is the day — your Session 1 checklist, ${firstName}`,
    html: dripShell(`
      <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;overflow:hidden;margin-bottom:20px">
        <div style="height:4px;background:linear-gradient(90deg,#10B981,#2563EB)"></div>
        <div style="padding:32px 28px">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#10B981">Today's Session</p>
          <h1 style="color:#F9FAFB;font-size:21px;font-weight:700;margin:8px 0 12px">${firstName}, Session 1 is today at ${opts.sessionTime}.</h1>
          <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0 0 20px">Quick checklist before you join:</p>
          ${checks.map(t => `
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
              <span style="font-size:16px;flex-shrink:0">✅</span>
              <p style="margin:0;font-size:13px;color:#D1D5DB;line-height:1.6">${t}</p>
            </div>`).join("")}
          <div style="margin-top:24px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:14px 18px">
            <p style="margin:0;font-size:13px;color:#6EE7B7;line-height:1.7">
              <strong>Session link</strong> will be in the WhatsApp group 30 minutes before the session.
            </p>
          </div>
        </div>
      </div>`),
  });
}

// ── Events Portal ─────────────────────────────────────────────────────────────

export async function sendEventSubmitted(to: string, name: string, eventTitle: string): Promise<void> {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `Your event "${eventTitle}" has been submitted for review`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Events</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Submission Received</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">Your event is under review, ${name?.split(" ")[0] ?? "there"}</h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      We received your submission for <strong style="color:#D1D5DB">${eventTitle}</strong>.
      Our team reviews all submissions within 2 business days.
    </p>
    <a href="${SITE_URL}/events" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">Browse the Events Board →</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendEventApproved(to: string, name: string, eventTitle: string, slug: string): Promise<void> {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `Your event is live — "${eventTitle}"`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Events</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#10B981;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Approved & Live</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">Your event is now visible to researchers, ${name?.split(" ")[0] ?? "there"}</h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      <strong style="color:#D1D5DB">${eventTitle}</strong> is now live on the Researchvy Events Board.
    </p>
    <a href="${SITE_URL}/events/${slug}" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">View Your Event →</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendEventRejected(to: string, name: string, eventTitle: string, reason: string): Promise<void> {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `Update on your event submission — "${eventTitle}"`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Events</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#F59E0B;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Submission Update</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">We couldn't approve this submission, ${name?.split(" ")[0] ?? "there"}</h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      After reviewing <strong style="color:#D1D5DB">${eventTitle}</strong>, we weren't able to publish it at this time.
    </p>
    ${reason ? `<div style="background:#1E293B;border-left:3px solid #F59E0B;border-radius:8px;padding:16px 18px;margin-bottom:24px"><p style="color:#6B7280;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px">Reviewer Note</p><p style="color:#D1D5DB;font-size:14px;line-height:1.7;margin:0">${reason}</p></div>` : ""}
    <a href="${SITE_URL}/dashboard/events" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">View My Submissions →</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendEventRSVP(to: string, name: string, eventTitle: string, eventDate: string, eventSlug: string, status: "registered" | "waitlisted"): Promise<void> {
  const r = await resend();
  const isWaitlisted = status === "waitlisted";
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: isWaitlisted ? `You're on the waitlist for "${eventTitle}"` : `RSVP confirmed — "${eventTitle}"`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Events</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:${isWaitlisted ? "#F59E0B" : "#10B981"};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">${isWaitlisted ? "Waitlist Confirmed" : "RSVP Confirmed"}</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">${isWaitlisted ? "You're on the waitlist" : "You're registered"}, ${name?.split(" ")[0] ?? "there"}</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0 0 4px">${eventTitle}</p>
      <p style="color:#9CA3AF;font-size:14px;margin:0">${eventDate}</p>
    </div>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      ${isWaitlisted ? "This event is at capacity. We'll notify you if a spot opens up." : "Your spot is confirmed. Check the event page for joining instructions."}
    </p>
    <a href="${SITE_URL}/events/${eventSlug}" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">View Event Details →</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a> · <a href="${SITE_URL}/dashboard/events" style="color:#4B5563;text-decoration:none">My Events</a></p>
  </div>
</div>
</body></html>`,
  });
}

// ── Opportunity community submission emails ───────────────────────────────────

export async function sendOpportunitySubmitted(to: string, name: string, oppTitle: string) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    bcc:     [ADMIN_CC],
    replyTo: REPLY_TO,
    subject: `We received your opportunity submission`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Opportunities</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#2563EB;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Submission Received</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">Thanks, ${name?.split(" ")[0] ?? "there"}</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0">${oppTitle}</p>
    </div>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Your opportunity submission is under review. Our team will check details and make it live on the board — usually within 48 hours.
    </p>
    <a href="${SITE_URL}/dashboard/opportunities" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">Track your submission &rarr;</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendOpportunityApproved(to: string, name: string, oppTitle: string) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `Your opportunity is live on the board`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Opportunities</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#10B981;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Approved &amp; Live</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">Your submission is now live, ${name?.split(" ")[0] ?? "there"}</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0">${oppTitle}</p>
    </div>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      Researchers across the Researchvy community can now discover and apply. Thank you for contributing to the board.
    </p>
    <a href="${SITE_URL}/opportunities" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">View on Opportunities Board &rarr;</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendOpportunityRejected(to: string, name: string, oppTitle: string, reason: string) {
  const r = await resend();
  const noteBlock = reason
    ? `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#D97706;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Reviewer Note</p>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0">${reason}</p>
    </div>`
    : "";
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `Update on your opportunity submission`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">Researchvy Opportunities</p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#F59E0B;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">Submission Update</p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">We could not approve this one, ${name?.split(" ")[0] ?? "there"}</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0">${oppTitle}</p>
    </div>
    ${noteBlock}
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      You are welcome to revise and resubmit. Check the board for currently active opportunities.
    </p>
    <a href="${SITE_URL}/opportunities/submit" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">Submit again &rarr;</a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0"><a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a></p>
  </div>
</div>
</body></html>`,
  });
}

// ── RSVP / Event Registration Confirmation ─────────────────────────────────────

export async function sendRSVPConfirmation(
  to: string,
  firstName: string,
  eventTitle: string,
  eventSlug: string,
  isWaitlisted: boolean,
) {
  const r = await resend();
  const statusLabel  = isWaitlisted ? "You're on the Waitlist" : "You're Registered";
  const statusColor  = isWaitlisted ? "#F59E0B" : "#10B981";
  const statusDetail = isWaitlisted
    ? "You've been added to the waitlist. We'll email you if a spot opens up — keep an eye on your inbox."
    : "Your spot is confirmed. Check your dashboard for updates and add the event to your calendar.";

  await r.emails.send({
    from:    FROM_TEAM,
    to:      [to],
    replyTo: REPLY_TO,
    subject: `${statusLabel}: ${eventTitle}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy Events
  </p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:${statusColor};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">${statusLabel}</p>
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.3">Hi ${firstName} — here's your confirmation.</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#9CA3AF;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:2px">Event</p>
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0">${eventTitle}</p>
    </div>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">${statusDetail}</p>
    <a href="${SITE_URL}/events/${eventSlug}"
       style="display:inline-block;background:${statusColor};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:16px">
      View Event Details &rarr;
    </a>
  </div>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#6B7280;font-size:13px;line-height:1.7;margin:0">
      Manage your RSVPs any time from your <a href="${SITE_URL}/dashboard/events" style="color:#60A5FA;text-decoration:underline">My Events</a> dashboard.
    </p>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/events" style="color:#4B5563;text-decoration:none">Browse Events</a>
    </p>
  </div>
</div>
</body></html>`,
  });
}

// ── Pre-Clinic Registration Confirmation ────────────────────────────────────

export async function sendPreClinicConfirmation(opts: {
  to:        string;
  firstName: string;
  session:   string; // 'saturday' | 'sunday' | 'both'
}) {
  const r         = await resend();
  const picked    = PRE_CLINIC_SESSIONS.find(s => s.id === opts.session) ?? PRE_CLINIC_SESSIONS[0];
  const waUrl     = buildWhatsAppUrl("Free ORCID Pre-Clinic");
  const firstName = escapeHtml(opts.firstName);

  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `You're registered — Researchvy Free Pre-Clinic (ORCID)`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy Free Pre-Clinic
  </p>
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <p style="color:#10B981;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">You're Registered</p>
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.3">Hi ${firstName} — your free spot is confirmed.</h1>
    <div style="background:#1E293B;border-radius:12px;padding:18px;margin-bottom:24px">
      <p style="color:#9CA3AF;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:2px">ORCID: Your Permanent Researcher Identity</p>
      <p style="color:#F9FAFB;font-size:16px;font-weight:600;margin:0">${picked.date} · ${picked.time}</p>
    </div>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 12px">This session is virtual — come with your laptop so you can create or fix your ORCID iD live alongside us.</p>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">We'll send your join link by email and WhatsApp closer to the date.</p>
    <a href="${waUrl}" target="_blank"
       style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 24px;border-radius:10px">
      Questions? Message us on WhatsApp →
    </a>
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/clinics" style="color:#4B5563;text-decoration:none">Explore the full Clinic</a>
    </p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendPreClinicAdminAlert(opts: {
  name:            string;
  email:           string;
  phone:           string;
  session:         string;
  careerStage:     string;
  fieldOfResearch: string;
  institution:     string | null;
}) {
  const r    = await resend();
  const name = escapeHtml(opts.name);
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [ADMIN_CC],
    replyTo: REPLY_TO,
    subject: `New Pre-Clinic registration: ${opts.name}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:28px">
    <p style="color:#4B5563;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">New Free Pre-Clinic Registration</p>
    <table style="width:100%;border-collapse:collapse">
      ${[
        ["Name", name],
        ["Email", escapeHtml(opts.email)],
        ["Phone", escapeHtml(opts.phone)],
        ["Session", escapeHtml(opts.session)],
        ["Career stage", escapeHtml(opts.careerStage)],
        ["Field of research", escapeHtml(opts.fieldOfResearch)],
        ["Institution", opts.institution ? escapeHtml(opts.institution) : "—"],
      ].map(([label, value]) => `
        <tr>
          <td style="padding:6px 0;color:#6B7280;font-size:12px;width:140px">${label}</td>
          <td style="padding:6px 0;color:#F9FAFB;font-size:13px;font-weight:600">${value}</td>
        </tr>`).join("")}
    </table>
  </div>
</div>
</body></html>`,
  });
}

// ── Deadline Reminder ─────────────────────────────────────────────────────────

export async function sendDeadlineReminderEmail(opts: {
  to:        string;
  firstName: string;
  oppTitle:  string;
  oppHref:   string;
  urgency:   string;   // "7 days" | "tomorrow"
  deadline:  string;   // ISO date string
}) {
  const r = await resend();
  const deadlineDate = new Date(opts.deadline).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const isUrgent = opts.urgency === "tomorrow";

  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `${isUrgent ? "⏰ " : ""}Deadline ${opts.urgency}: ${opts.oppTitle}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;text-align:center">Researchvy</p>

  <div style="background:#0F172A;border:1px solid ${isUrgent ? "#EF4444" : "#1E293B"};border-radius:20px;padding:36px;margin-bottom:24px">
    <div style="display:inline-block;background:${isUrgent ? "rgba(239,68,68,0.1)" : "rgba(37,99,235,0.1)"};border-radius:8px;padding:6px 12px;margin-bottom:20px">
      <span style="color:${isUrgent ? "#F87171" : "#60A5FA"};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase">
        ${isUrgent ? "Closing Tomorrow" : "7 Days Remaining"}
      </span>
    </div>

    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 12px;line-height:1.3">
      Don't miss this opportunity, ${opts.firstName}
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 20px">
      <strong style="color:#F9FAFB">${opts.oppTitle}</strong> closes on
      <strong style="color:${isUrgent ? "#F87171" : "#F9FAFB"}">${deadlineDate}</strong>.
    </p>

    <a href="${opts.oppHref}"
      style="display:inline-block;background:${isUrgent ? "#DC2626" : "#2563EB"};color:#fff;text-decoration:none;border-radius:10px;padding:14px 28px;font-size:15px;font-weight:600">
      View Opportunity →
    </a>
  </div>

  <div style="text-align:center;padding-top:20px">
    <p style="color:#374151;font-size:12px;margin:0">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/opportunities" style="color:#4B5563;text-decoration:none">Browse Opportunities</a>
    </p>
  </div>
</div>
</body></html>`,
  });
}

// ── Scorecard helpers ─────────────────────────────────────────────────────────

const CHECKPOINT_META: Record<string, { label: string; maxPoints: number; dim: string }> = {
  orcid:         { label: "ORCID iD",                    maxPoints: 9, dim: "Scholar Identity"             },
  googlescholar: { label: "Google Scholar",               maxPoints: 8, dim: "Scholar Identity"             },
  scopus:        { label: "Scopus Author Profile",        maxPoints: 8, dim: "Scholar Identity"             },
  openaccess:    { label: "Open Access Rate",             maxPoints: 9, dim: "Discoverability"              },
  keywords:      { label: "Keywords & Abstracts",         maxPoints: 8, dim: "Discoverability"              },
  repository:    { label: "Institutional Repository",     maxPoints: 8, dim: "Discoverability"              },
  cppratio:      { label: "Citations Per Paper vs. Field",maxPoints: 9, dim: "Citation Health"              },
  hefficiency:   { label: "h-index Efficiency",           maxPoints: 8, dim: "Citation Health"              },
  alerts:        { label: "Citation Alert System",        maxPoints: 8, dim: "Citation Health"              },
  laysummaries:  { label: "Lay Summary Practice",         maxPoints: 9, dim: "Research Communication"       },
  socialmedia:   { label: "Professional Online Presence", maxPoints: 8, dim: "Research Communication"       },
  crosssector:   { label: "Cross-Sector Engagement",      maxPoints: 8, dim: "Research Communication"       },
};

const DIM_COLORS: Record<string, string> = {
  identity:        "#2563EB",
  discoverability: "#7C3AED",
  citationhealth:  "#059669",
  communication:   "#D97706",
};

const DIM_LABELS: Record<string, string> = {
  identity:        "Scholar Identity",
  discoverability: "Discoverability",
  citationhealth:  "Citation Health",
  communication:   "Research Communication",
};

function tierLabel(tier: string): string {
  const map: Record<string, string> = {
    leader:          "Visibility Leader",
    emerging:        "Emerging Researcher",
    significant_gaps:"Significant Gaps",
    invisible:       "Invisible",
  };
  return map[tier] ?? tier;
}

function tierColor(tier: string): string {
  const map: Record<string, string> = {
    leader:           "#10B981",
    emerging:         "#F59E0B",
    significant_gaps: "#F97316",
    invisible:        "#EF4444",
  };
  return map[tier] ?? "#6B7280";
}

// ── Scorecard lead email (to the researcher) ──────────────────────────────────

export async function sendScorecardLeadEmail(opts: {
  to:         string;
  firstName:  string;
  score:      number;
  tier:       string;
  answers:    Record<string, number>;
  dimScores:  Record<string, { score: number; maxPoints: number }>;
  leadId:     string;
}) {
  const r = await resend();

  // Find 3 lowest-scoring checkpoints (by % of max)
  const gaps = Object.entries(opts.answers)
    .map(([id, val]) => {
      const meta = CHECKPOINT_META[id];
      if (!meta) return null;
      return { id, label: meta.label, dim: meta.dim, pct: meta.maxPoints > 0 ? val / meta.maxPoints : 1 };
    })
    .filter(Boolean)
    .sort((a, b) => (a!.pct - b!.pct))
    .slice(0, 3) as { id: string; label: string; dim: string; pct: number }[];

  const color     = tierColor(opts.tier);
  const tLabel    = tierLabel(opts.tier);
  const clinicUrl      = `${SITE_URL}/clinics/digital-visibility-clinic`;
  const consultingUrl  = `${SITE_URL}/clinics/private-consulting`;
  const waText         = encodeURIComponent(`Hi, I scored ${opts.score}/100 on the Researcher Visibility Scorecard. I'd like to discuss a strategy for improving my visibility.`);
  const waUrl          = `https://wa.me/${siteConfig.whatsapp.number}?text=${waText}`;

  const dimRows = Object.entries(opts.dimScores).map(([id, d]) => {
    const pct   = d.maxPoints > 0 ? Math.round((d.score / d.maxPoints) * 100) : 0;
    const bg    = DIM_COLORS[id] ?? "#6B7280";
    const label = DIM_LABELS[id] ?? id;
    return `
      <tr>
        <td style="padding:8px 0;color:#9CA3AF;font-size:13px">${label}</td>
        <td style="padding:8px 0 8px 12px;color:${bg};font-size:13px;font-weight:700;text-align:right;white-space:nowrap">
          ${d.score}/${d.maxPoints} &nbsp;(${pct}%)
        </td>
      </tr>`;
  }).join("");

  const gapItems = gaps.map(g => `
    <li style="color:#9CA3AF;font-size:14px;line-height:1.7;margin-bottom:8px">
      <strong style="color:#F9FAFB">${g.label}</strong>
      <span style="color:#6B7280;font-size:12px"> — ${g.dim}</span>
    </li>`).join("");

  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `Your Visibility Scorecard: ${opts.score}/100 — ${tLabel}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy · Researcher Visibility Scorecard
  </p>

  <!-- Score card -->
  <div style="background:${color}12;border:1px solid ${color}30;border-radius:20px;padding:32px;text-align:center;margin-bottom:24px">
    <p style="color:${color};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px">
      Your Visibility Score
    </p>
    <p style="color:#F9FAFB;font-size:64px;font-weight:800;margin:0 0 4px;line-height:1">${opts.score}</p>
    <p style="color:${color};font-size:16px;font-weight:700;margin:0 0 16px">${tLabel}</p>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.7;margin:0">
      Hi ${opts.firstName}, here is your complete visibility breakdown and your highest-priority gaps.
    </p>
  </div>

  <!-- Dimension breakdown -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#F9FAFB;font-size:14px;font-weight:700;margin:0 0 16px">Your dimension breakdown</p>
    <table style="width:100%;border-collapse:collapse">
      ${dimRows}
    </table>
  </div>

  <!-- Priority gaps -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#F87171;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px">
      Your 3 priority gaps
    </p>
    <p style="color:#6B7280;font-size:13px;margin:0 0 16px">
      These are the checkpoints where you are losing the most visibility relative to your potential:
    </p>
    <ul style="padding-left:20px;margin:0">${gapItems}</ul>
  </div>

  <!-- Benchmark -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#9CA3AF;font-size:13px;line-height:1.7;margin:0">
      The global researcher average is <strong style="color:#F9FAFB">34/100</strong>.
      Researchers who complete the Digital Visibility Clinic exit at an average of
      <strong style="color:#10B981">79/100</strong> across 5 core sessions.
    </p>
  </div>

  <!-- CTA -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-top:3px solid #2563EB;border-radius:16px;padding:32px;margin-bottom:24px">
    <p style="color:#93C5FD;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">
      Your next step
    </p>
    <h2 style="color:#F9FAFB;font-size:20px;font-weight:700;margin:0 0 12px;line-height:1.3">
      Book a free 20-minute strategy call
    </h2>
    <p style="color:#6B7280;font-size:14px;line-height:1.7;margin:0 0 24px">
      We will review your specific gaps, show you what the biggest lever is for your profile,
      and help you decide between the Clinic (cohort) and Private Consulting (1-on-1 done-for-you).
    </p>
    <a href="${waUrl}"
       style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:12px;margin-bottom:12px">
      Book a Free Strategy Call →
    </a>
    <br>
    <a href="${clinicUrl}"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:12px;margin-top:4px;margin-bottom:12px">
      Claim My Spot in the Clinic →
    </a>
    <br>
    <a href="${consultingUrl}"
       style="display:inline-block;background:rgba(139,92,246,0.15);color:#A78BFA;text-decoration:none;font-weight:700;font-size:13px;padding:12px 22px;border-radius:10px;border:1px solid rgba(139,92,246,0.3);margin-top:4px">
      Prefer 1-on-1? View Private Consulting — from $209 →
    </a>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Researchvy · Making researchers discoverable, globally.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">researchvy.com</a>
      &nbsp;·&nbsp;
      <a href="${clinicUrl}" style="color:#4B5563;text-decoration:none">Clinic</a>
      &nbsp;·&nbsp;
      <a href="${consultingUrl}" style="color:#4B5563;text-decoration:none">Private Consulting</a>
    </p>
    <p style="color:#374151;font-size:11px;margin:8px 0 0">
      You received this because you completed the Researcher Visibility Scorecard.
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Clinic waitlist confirmation ──────────────────────────────────────────────

export async function sendWaitlistConfirmationEmail(opts: {
  to:        string;
  firstName: string;
}) {
  const clinicUrl = `${SITE_URL}/clinics/digital-visibility-clinic`;
  const waText    = encodeURIComponent("Hi, I just joined the waitlist for the Digital Visibility Clinic. I'd love to know when the next cohort opens.");
  const waUrl     = `https://wa.me/${siteConfig.whatsapp.number}?text=${waText}`;

  const r = await resend();
  await Promise.all([
    r.emails.send({
      from:    FROM_TEAM,
      to:      [opts.to],
      replyTo: REPLY_TO,
      subject: `You're on the waitlist — Digital Visibility Clinic`,
      html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-top:3px solid #2563EB;border-radius:20px;padding:40px;margin-bottom:24px">
    <p style="color:#93C5FD;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px">
      Waitlist Confirmed
    </p>
    <h1 style="color:#F9FAFB;font-size:24px;font-weight:700;margin:0 0 16px;line-height:1.3">
      You're on the list, ${opts.firstName}.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      The current cohort is full. We'll email you as soon as registration opens for the next Digital Visibility Clinic cohort — you'll be among the first to know.
    </p>

    <div style="background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);border-radius:12px;padding:18px;margin-bottom:28px">
      <p style="color:#93C5FD;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">
        What happens next
      </p>
      <ul style="color:#9CA3AF;font-size:14px;line-height:2;margin:0;padding-left:18px">
        <li>You'll get a priority email the moment the next cohort opens</li>
        <li>Waitlist members get first access — before the general public</li>
        <li>No payment required until you choose to enroll</li>
      </ul>
    </div>

    <a href="${waUrl}" target="_blank"
       style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:12px;margin-bottom:12px">
      Message us on WhatsApp →
    </a>
    <br>
    <a href="${clinicUrl}"
       style="display:inline-block;color:#6B7280;text-decoration:none;font-size:13px;padding:8px 0">
      Learn more about the clinic →
    </a>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Researchvy · Making researchers discoverable, globally.<br>
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">researchvy.com</a>
      &nbsp;·&nbsp;
      <a href="${clinicUrl}" style="color:#4B5563;text-decoration:none">Digital Visibility Clinic</a>
    </p>
  </div>

</div>
</body>
</html>`,
    }),
    r.emails.send({
      from:    FROM_TEAM,
      to:      [ADMIN_CC],
      subject: `New waitlist signup: ${opts.firstName} <${opts.to}>`,
      html:    `<p>New waitlist signup:<br><strong>${opts.firstName}</strong> — ${opts.to}</p><p>Digital Visibility Clinic</p>`,
    }),
  ]);
}

// ── Scorecard admin alert (to researchvy@gmail.com) ───────────────────────────

export async function sendScorecardAdminAlert(opts: {
  name:      string;
  email:     string;
  score:     number;
  tier:      string;
  dimScores: Record<string, { score: number; maxPoints: number }>;
  leadId:    string;
}) {
  const r        = await resend();
  const color    = tierColor(opts.tier);
  const tLabel   = tierLabel(opts.tier);
  const adminUrl = `${SITE_URL}/admin/scorecard/${opts.leadId}`;
  const waText   = encodeURIComponent(`Hi ${opts.name.split(" ")[0]}, I saw your Researcher Visibility Scorecard score (${opts.score}/100). I'd love to chat about your specific gaps and how we can help.`);
  const waUrl    = `https://wa.me/${siteConfig.whatsapp.number}?text=${waText}`;

  const dimRows = Object.entries(opts.dimScores).map(([id, d]) => {
    const pct   = d.maxPoints > 0 ? Math.round((d.score / d.maxPoints) * 100) : 0;
    const label = DIM_LABELS[id] ?? id;
    const barW  = Math.round((d.score / d.maxPoints) * 120);
    return `
      <tr>
        <td style="padding:6px 0;color:#9CA3AF;font-size:13px;width:180px">${label}</td>
        <td style="padding:6px 0 6px 12px">
          <div style="background:#1E293B;border-radius:4px;height:6px;width:120px;display:inline-block;vertical-align:middle">
            <div style="background:${DIM_COLORS[id] ?? "#6B7280"};width:${barW}px;height:6px;border-radius:4px"></div>
          </div>
        </td>
        <td style="padding:6px 0 6px 8px;color:#F9FAFB;font-size:13px;font-weight:700;white-space:nowrap">
          ${d.score}/${d.maxPoints} (${pct}%)
        </td>
      </tr>`;
  }).join("");

  await r.emails.send({
    from:    FROM_TEAM,
    to:      [ADMIN_CC],
    replyTo: opts.email,
    subject: `🎯 New Scorecard Lead: ${opts.name} scored ${opts.score}/100 — ${tLabel}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;text-align:center">
    Researchvy Admin · New Scorecard Lead
  </p>

  <!-- Score summary -->
  <div style="background:${color}12;border:1px solid ${color}30;border-radius:16px;padding:24px;margin-bottom:20px;display:flex;align-items:center;gap:20px">
    <div style="text-align:center;min-width:80px">
      <p style="color:#F9FAFB;font-size:48px;font-weight:800;margin:0;line-height:1">${opts.score}</p>
      <p style="color:${color};font-size:11px;font-weight:700;margin:4px 0 0;text-transform:uppercase">${tLabel}</p>
    </div>
    <div>
      <p style="color:#F9FAFB;font-size:16px;font-weight:700;margin:0 0 4px">${opts.name}</p>
      <p style="color:#60A5FA;font-size:14px;margin:0 0 8px">
        <a href="mailto:${opts.email}" style="color:#60A5FA">${opts.email}</a>
      </p>
      <p style="color:#6B7280;font-size:12px;margin:0">Lead ID: ${opts.leadId}</p>
    </div>
  </div>

  <!-- Dimension breakdown -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:14px;padding:20px;margin-bottom:20px">
    <p style="color:#F9FAFB;font-size:13px;font-weight:700;margin:0 0 14px">Dimension breakdown</p>
    <table style="width:100%;border-collapse:collapse">${dimRows}</table>
  </div>

  <!-- Actions -->
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
    <a href="${adminUrl}"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:12px 20px;border-radius:10px">
      View in Admin Dashboard →
    </a>
    <a href="${waUrl}"
       style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:12px 20px;border-radius:10px">
      Follow up via WhatsApp
    </a>
    <a href="mailto:${opts.email}"
       style="display:inline-block;background:#1E293B;color:#F9FAFB;text-decoration:none;font-weight:700;font-size:13px;padding:12px 20px;border-radius:10px;border:1px solid #374151">
      Reply by email
    </a>
  </div>

  <div style="text-align:center;padding-top:20px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0">
      Researchvy Admin · <a href="${SITE_URL}/admin/scorecard" style="color:#4B5563;text-decoration:none">All Scorecard Leads</a>
    </p>
  </div>
</div>
</body>
</html>`,
  });
}
