// Central email utility. All transactional emails go through this module.
// Uses Resend (free tier: 3,000/month). Fire-and-forget on the server — never
// await these in critical paths; they must never break user-facing flows.

import { digitalVisibilityClinic } from "@/constants/clinics";

const FROM_ACADEMY = "Researchvy Academy <info@researchvy.com>";
const FROM_TEAM    = "Researchvy Team <info@researchvy.com>";
const REPLY_TO     = "info@researchvy.com";
const ADMIN_CC     = "researchvy@gmail.com";
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com";

async function resend() {
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
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

    <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:24px">
      <p style="color:#60A5FA;font-size:13px;font-weight:600;margin:0 0 8px">Your first three steps:</p>
      <ol style="color:#9CA3AF;font-size:14px;line-height:1.9;margin:0;padding-left:20px">
        <li>Complete your researcher profile — add your ORCID and institution</li>
        <li>Start Level 1 of the Academy — 100% free, no payment needed</li>
        <li>Explore all Researchvy programmes at your own pace</li>
      </ol>
    </div>

    <a href="${SITE_URL}/dashboard"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">
      Go to your dashboard →
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
    subject: `${opts.firstName}, your first step to research visibility`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4">
      Hi ${opts.firstName} — one free lesson, 15 minutes.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      You signed up yesterday. Most researchers explore for a week and then
      it gets busy — and nothing changes about their visibility.
    </p>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 24px">
      The researchers who move fastest usually start with one specific habit:
      they make their abstract <strong style="color:#D1D5DB">searchable</strong>.
      It takes 15 minutes. It lasts a career.
    </p>
    <div style="background:#0A0F1A;border:1px solid #1E293B;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#60A5FA;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Free lesson</p>
      <p style="color:#E2E8F0;font-size:16px;font-weight:600;margin:0 0 4px">Keyword Strategy for Research Abstracts</p>
      <p style="color:#6B7280;font-size:13px;margin:0">Level 1 · Foundations · ~15 min</p>
    </div>
    <a href="${SITE_URL}/academy/courses"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">
      Start the free lesson →
    </a>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/academy/courses" style="color:#4B5563;text-decoration:none">Academy</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}

// ── Day-5 drip (course enrollment nudge) ─────────────────────────────────────

export async function sendDay5DripEmail(opts: { to: string; firstName: string }) {
  const r = await resend();
  await r.emails.send({
    from:    FROM_TEAM,
    to:      [opts.to],
    replyTo: REPLY_TO,
    subject: `The visibility gap is widening, ${opts.firstName}`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy Academy
  </p>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;margin-bottom:32px">
    <h1 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4">
      ${opts.firstName}, here's what separates cited researchers from invisible ones.
    </h1>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.8;margin:0 0 20px">
      It's not prestige. It's not luck. It's a small set of learnable skills
      that most researchers were never taught in their PhD programme.
    </p>
    <div style="border-left:3px solid #A78BFA;padding-left:16px;margin-bottom:24px">
      <p style="color:#A78BFA;font-size:13px;font-weight:600;margin:0 0 8px">What the Academy teaches:</p>
      <ul style="color:#9CA3AF;font-size:14px;line-height:2;margin:0;padding-left:20px">
        <li>How to make your research <em>discoverable</em> on every major platform</li>
        <li>Building a scholarly identity that precedes your papers</li>
        <li>Writing abstracts that rank and get read</li>
        <li>Turning one paper into 6 months of visibility content</li>
        <li>Getting cited by researchers who've never met you</li>
      </ul>
    </div>
    <a href="${SITE_URL}/academy/courses"
       style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:16px">
      Explore Academy courses →
    </a>
    <p style="color:#4B5563;font-size:12px;margin:8px 0 0">
      Several courses are free. No credit card needed.
    </p>
  </div>

  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:24px;margin-bottom:24px">
    <p style="color:#6B7280;font-size:13px;line-height:1.7;margin:0">
      Questions about the Academy or your visibility strategy? Reply to this email — we read every one.
    </p>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid #1E293B">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      <a href="${SITE_URL}" style="color:#4B5563;text-decoration:none">Researchvy</a>
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

    <a href="${SITE_URL}/academy/courses"
       style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px">
      Explore the free Academy courses →
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
        ["Programme",     "Digital Visibility Clinic — July 2026"],
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
    subject: `You're in — DVC July 2026 enrollment confirmed (${opts.orderNumber})`,
    html: `<!DOCTYPE html><html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">

  <div style="background:#0F172A;border-radius:20px;overflow:hidden;margin-bottom:24px;">
    <div style="height:4px;background:linear-gradient(90deg,#2563EB,#10B981);"></div>
    <div style="padding:40px 32px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#2563EB;">
        Digital Visibility Clinic · July 2026
      </p>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;line-height:1.3;color:#F9FAFB;">
        You're enrolled, ${firstName}.
      </h1>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#9CA3AF;">
        Payment confirmed. Your place in the July 2026 cohort is secured.
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
        ["Cohort",       "July 2026"],
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
