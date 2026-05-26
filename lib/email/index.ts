// Central email utility. All transactional emails go through this module.
// Uses Resend (free tier: 3,000/month). Fire-and-forget on the server — never
// await these in critical paths; they must never break user-facing flows.

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
        <li>Complete your researcher profile</li>
        <li>Explore the Academy — start with a free lesson</li>
        <li>Register for the Digital Visibility Clinic</li>
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
