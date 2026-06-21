function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const BASE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  color: #111827;
`;

const HEADER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080E1A;padding:28px 32px;">
    <tr>
      <td>
        <a href="https://researchvy.com" style="text-decoration:none;">
          <span style="color:#F9FAFB;font-size:18px;font-weight:700;letter-spacing:-0.02em;">Researchvy</span>
          <span style="color:#2563EB;font-size:18px;font-weight:700;">.</span>
        </a>
      </td>
    </tr>
  </table>
`;

const FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 32px;background:#F9FAFB;border-top:1px solid #E5E7EB;">
    <tr>
      <td style="color:#9CA3AF;font-size:12px;line-height:1.6;">
        <p style="margin:0 0 6px;">You're receiving this because you subscribed to Researchvy Insights.</p>
        <p style="margin:0;">
          © ${new Date().getFullYear()} Researchvy ·
          <a href="https://researchvy.com" style="color:#6B7280;">researchvy.com</a> ·
          <a href="https://researchvy.com/contact" style="color:#6B7280;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
`;

// ── Email 1: Immediate welcome ────────────────────────────────────────────────

export function welcomeEmail(email: string): { subject: string; html: string } {
  void email;
  return {
    subject: "Most researchers don't know this about their visibility",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Welcome to Researchvy</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}

    <!-- Hero -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 32px;">
      <tr>
        <td>
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">
            Welcome to Researchvy
          </p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;color:#111827;">
            You've been publishing for years.<br/>
            Here's what nobody told you.
          </h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            The average researcher has no idea how visible, or invisible, their work actually
            is. They assume citations are slow because the field is small, or the journal
            wasn't prestigious enough, or their timing was off.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            Almost always, the real reason is simpler: <strong style="color:#111827;">the discovery systems
            that researchers use to find work simply cannot find yours.</strong>
          </p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
            Not because your research isn't good enough. Because your visibility is broken,
            and nobody in academia ever taught you how to fix it.
          </p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px;">
      <tr><td style="border-top:1px solid #E5E7EB;"></td></tr>
    </table>

    <!-- Case study -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px;">
      <tr>
        <td style="background:#F0F9FF;border-left:3px solid #2563EB;padding:20px 24px;border-radius:0 8px 8px 0;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">
            Real researcher · Real result
          </p>
          <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">
            Dr. Amara Osei, 51 publications. h-index of 3.
          </p>
          <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#374151;">
            After 8 years of publishing, her visibility audit revealed: 17 publications
            missing from Google Scholar, 2 conflicting Scopus author IDs splitting her
            citations, and an unverified ORCID that journals couldn't link to her work.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">
            Four months after the Digital Visibility Clinic:
            <strong style="color:#059669;">h-index 3 → 7. Citations 28 → 94.</strong>
            The research hadn't changed. Her visibility had.
          </p>
        </td>
      </tr>
    </table>

    <!-- Quick check -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr>
        <td>
          <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">
            One thing you can check right now (takes 2 minutes)
          </h2>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">
            Go to your Google Scholar profile. Count how many publications are listed.
            Now count how many you've actually published.
          </p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#374151;">
            If those numbers don't match, and for most researchers they don't,
            <strong style="color:#111827;">your work is invisible to everyone searching for it.</strong>
            That's the most common gap the audit finds. And it's one of the fastest to fix.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;font-style:italic;">
            Over the next few days, we'll send you a full 5-point visibility self-check and
            a breakdown of exactly what the Digital Visibility Clinic covers, session by session.
            In the meantime, take the full Researcher Visibility Scorecard below.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 40px;">
      <tr>
        <td>
          <a href="https://researchvy.com/resources/visibility-scorecard"
             style="display:inline-block;background:#10B981;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;margin-bottom:12px;">
            Take the Researcher Visibility Scorecard →
          </a>
          <br/>
          <a href="https://researchvy.com/clinics/digital-visibility-clinic"
             style="display:inline-block;color:#2563EB;font-size:13px;font-weight:600;text-decoration:none;">
            Or see the Digital Visibility Clinic →
          </a>
          <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">
            Or reply to this email with your biggest visibility challenge.
            We read every reply.
          </p>
        </td>
      </tr>
    </table>

    ${FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Email 2: Day 3 — Visibility self-check ────────────────────────────────────

export function day3Email(): { subject: string; html: string } {
  return {
    subject: "A 5-minute visibility check (most researchers fail 3 of 5)",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Your Visibility Self-Check</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}

    <!-- Intro -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr>
        <td>
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">
            Researchvy Visibility Check
          </p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;color:#111827;">
            Run this on yourself.<br/>Before someone else does.
          </h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#374151;">
            Every visibility audit we run covers these five areas. Most researchers fail
            at least two of them, and have no idea. Take 5 minutes now.
          </p>
        </td>
      </tr>
    </table>

    <!-- 5-point checklist -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 8px;">
      <tr>
        <td>
          ${[
            {
              n: "1",
              title: "Google Scholar, is it complete?",
              check: "Open your Google Scholar profile. Count the publications listed. Does it match everything you've published? Are your name variants covered? Is your institutional email verified?",
              fail: "Missing publications means you're invisible in Google's academic search, the first place most researchers look.",
            },
            {
              n: "2",
              title: "ORCID, is it verified and populated?",
              check: "Log into orcid.org. Are all your works claimed? Is your iD verified (green tick)? Have you connected your institutional affiliation?",
              fail: "Without a verified ORCID, journals and indexing systems cannot programmatically attribute your work to you.",
            },
            {
              n: "3",
              title: "Scopus, one profile or two?",
              check: "Search your name on Scopus. If you see two author profiles, your citation count is split. This directly suppresses your h-index.",
              fail: "Duplicate Scopus IDs are one of the most common and most damaging visibility problems, and completely fixable.",
            },
            {
              n: "4",
              title: "Research keywords, do they match what your field searches?",
              check: "Look at the keywords on your profiles and in your paper abstracts. Are they the terms other researchers actually type when looking for work in your area?",
              fail: "Mismatched keywords mean your papers don't surface in discovery system searches, even when they're directly relevant.",
            },
            {
              n: "5",
              title: "Institutional profile, updated in the last 12 months?",
              check: "Check your institutional researcher profile page. Is your publication list current? Is there a working link to your Google Scholar and ORCID?",
              fail: "Institutional profiles are crawled by Google and often rank above your personal pages. An outdated one actively misleads people looking for you.",
            },
          ].map(({ n, title, check, fail }) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;">
                        <span style="display:inline-block;width:24px;height:24px;background:#2563EB;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#fff;">${n}</span>
                      </td>
                      <td style="padding-left:12px;vertical-align:top;">
                        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#111827;">${title}</p>
                        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#374151;">${check}</p>
                        <p style="margin:0;font-size:12px;line-height:1.5;color:#DC2626;"><strong>If you fail this:</strong> ${fail}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <!-- Diagnosis -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:8px 32px 32px;">
      <tr>
        <td style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#991B1B;">
            Failed 2 or more?
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
            Your citations are being lost right now. Researchers who should be citing your
            work can't find it, not because they don't want to, but because the systems
            they use can't surface it. This is fixable. It just requires knowing exactly
            where to look.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 40px;">
      <tr>
        <td>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            Want a professional audit that covers all five areas, with a
            prioritised fix list and specific actions?
          </p>
          <a href="https://wa.me/2347030515183?text=${encodeURIComponent("Hello, I'd like to request a Researchvy visibility audit. Could you share more details about the process and pricing?")}"
             style="display:inline-block;background:#25D366;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">
            Request My Visibility Audit →
          </a>
          <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">
            We'll respond within 24 hours with exactly what your audit would cover.
          </p>
        </td>
      </tr>
    </table>

    ${FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Email 3: Day 7 — The offer ────────────────────────────────────────────────

export function day7Email(): { subject: string; html: string } {
  return {
    subject: "5 core sessions. One complete visibility transformation.",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Digital Visibility Clinic</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}

    <!-- Urgency header -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;padding:12px 32px;border-bottom:1px solid #BBF7D0;">
      <tr>
        <td style="font-size:13px;color:#166534;font-weight:600;">
          Next cohort forming now · ≤20 researchers · Verified certificate on completion
        </td>
      </tr>
    </table>

    <!-- Intro -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr>
        <td>
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">
            Digital Visibility Clinic
          </p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;color:#111827;">
            5 core sessions.<br/>One complete visibility transformation.
          </h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            Dr. Amara Osei had 51 publications and an h-index of 3. After the clinic:
            <strong style="color:#059669;">h-index 3 → 7. Citations 28 → 94.</strong>
            Four months. The research didn't change. The visibility did.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">
            Here's exactly what the programme covers:
          </p>
        </td>
      </tr>
    </table>

    <!-- Sessions -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr>
        <td>
          ${[
            { n: "S1", title: "Scholar Identity Audit", desc: "Full live review of your Google Scholar, ORCID, and Scopus profiles. Disambiguation fixed, all publications attributed, citations flowing to one identity.", bg: "#EFF6FF", color: "#2563EB" },
            { n: "S2", title: "Discoverability & Citation Intelligence", desc: "Keyword strategy, open access optimisation, repository presence, and a personal citation growth strategy that doesn't require publishing more.", bg: "#EFF6FF", color: "#2563EB" },
            { n: "S3", title: "Research Communication + 12-Month Roadmap", desc: "Lay summaries, visual abstracts, cross-sector engagement — and your personalised 12-month visibility strategy built live during the session.", bg: "#EFF6FF", color: "#2563EB" },
            { n: "B1", title: "Bonus Masterclass: Bibliometrics & h-index Strategy", desc: "How promotion panels and grant reviewers use bibliometrics — and the ethical, evidence-based strategies to improve your metrics.", bg: "#F5F3FF", color: "#7C3AED" },
            { n: "B2", title: "Bonus Masterclass: Research Communication for Global Audiences", desc: "Policy briefs, media coverage, and practitioner engagement — how to translate your research findings for the audiences who can act on them.", bg: "#F5F3FF", color: "#7C3AED" },
          ].map(({ n, title, desc, bg, color }) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <span style="display:inline-block;width:28px;height:28px;background:${bg};border-radius:6px;text-align:center;line-height:28px;font-size:11px;font-weight:700;color:${color};">${n}</span>
                </td>
                <td style="padding-left:10px;vertical-align:top;border-bottom:1px solid #F3F4F6;padding-bottom:10px;">
                  <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#111827;">${title}</p>
                  <p style="margin:0;font-size:13px;line-height:1.5;color:#6B7280;">${desc}</p>
                </td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <!-- What you leave with -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr>
        <td style="background:#F0F9FF;border:1px solid #BFDBFE;border-radius:8px;padding:20px 24px;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;">You leave with:</p>
          ${[
            "A fully optimised digital scholarly identity across every major platform",
            "A personal research visibility strategy tailored to your discipline",
            "A verified Certificate of Scholarly Visibility Practice",
            "Access to all session recordings and the alumni resource library",
            "A clear, measurable baseline so you can track exactly what moves",
          ].map(item => `
            <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#374151;">
              <span style="color:#2563EB;font-weight:700;">✓</span> ${item}
            </p>
          `).join("")}
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 16px;">
      <tr>
        <td>
          <a href="https://wa.me/2347030515183?text=${encodeURIComponent("Hello, I'd like to claim my spot in the Digital Visibility Clinic. Could you share pricing and the next cohort date?")}"
             style="display:inline-block;background:#25D366;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;margin-bottom:12px;">
            Claim My Spot via WhatsApp →
          </a>
          <br/>
          <a href="https://researchvy.com/clinics/digital-visibility-clinic"
             style="display:inline-block;color:#2563EB;font-size:13px;font-weight:600;text-decoration:none;">
            Or see the full programme details →
          </a>
        </td>
      </tr>
    </table>

    <!-- Risk removal -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 40px;">
      <tr>
        <td style="background:#F9FAFB;border-radius:8px;padding:16px 20px;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;">
            <strong style="color:#374151;">Not sure yet?</strong> Reply to this email with your
            biggest visibility challenge, where you feel most stuck or most invisible.
            We'll tell you exactly how the clinic addresses it. No obligation.
          </p>
        </td>
      </tr>
    </table>

    ${FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Transactional footer (no unsubscribe — these are account/action emails) ───

const TRANSACTIONAL_FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 32px;background:#F9FAFB;border-top:1px solid #E5E7EB;">
    <tr>
      <td style="color:#9CA3AF;font-size:12px;line-height:1.6;">
        <p style="margin:0 0 4px;">This is a transactional confirmation from Researchvy.</p>
        <p style="margin:0;">© ${new Date().getFullYear()} Researchvy · <a href="https://researchvy.com" style="color:#6B7280;">researchvy.com</a></p>
      </td>
    </tr>
  </table>
`;

// ── Clinic interest confirmation ──────────────────────────────────────────────

export function clinicInterestConfirmation(
  name: string,
  email: string,
  clinicName: string,
): { subject: string; html: string } {
  const displayName = esc(name || email.split("@")[0]);
  const safeClinic  = esc(clinicName);
  const safeEmail   = esc(email);
  return {
    subject: `You're registered, ${clinicName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Interest Registered</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#10B981;">Interest Registered</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">We've got you, ${displayName}.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
          Your interest in the <strong style="color:#111827;">${safeClinic}</strong> has been registered.
          You're now on the priority contact list, we'll reach out to <strong style="color:#111827;">${safeEmail}</strong>
          within 3–5 business days with cohort dates, pricing, and next steps.
        </p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
          Spots in each cohort are limited to ensure every participant gets direct expert attention,
          so early registration gives you the best chance of securing your preferred cohort.
        </p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#F0F9FF;border-left:3px solid #2563EB;padding:20px 24px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#2563EB;">What happens next</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#111827;">Within 3–5 days:</strong> We contact you with cohort dates and a personalised programme overview</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#111827;">Before you start:</strong> You complete a brief pre-assessment so Session 1 is tailored to your specific gaps</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#111827;">After the clinic:</strong> Full audit, optimised profile stack, and a 12-month visibility strategy</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#374151;">
          While you wait, take the free Researcher Visibility Scorecard, 4 minutes, showing you exactly
          where your profile stands across all four visibility dimensions.
        </p>
        <a href="https://researchvy.com/resources/visibility-scorecard"
           style="display:inline-block;background:#10B981;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">
          Take the Free Visibility Scorecard →
        </a>
        <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">Questions? Reply to this email, we read every message.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Academy interest confirmation ─────────────────────────────────────────────

export function academyInterestConfirmation(
  name: string,
  email: string,
): { subject: string; html: string } {
  const displayName = esc(name || email.split("@")[0]);
  return {
    subject: "You're registered, Research Visibility Academy",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Academy Interest Registered</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8B5CF6;">Academy Interest Registered</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">Welcome to the waitlist, ${displayName}.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
          Your interest in the <strong style="color:#111827;">Research Visibility Academy</strong> is confirmed.
          We'll reach out to <strong style="color:#111827;">${email}</strong> within 5–7 business days with
          programme details, cohort start dates, and enrolment information.
        </p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
          The Academy runs in structured cohorts, registered members get priority access before we open publicly.
        </p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#F5F3FF;border-left:3px solid #8B5CF6;padding:20px 24px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">What you'll cover</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 1:</strong> Scholar Identity &amp; Profile Architecture</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 2:</strong> Discoverability Systems (ORCID, Google Scholar, Scopus)</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 3:</strong> Citation Intelligence &amp; Bibliometrics</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 4:</strong> Research Communication for Non-Academic Audiences</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 5:</strong> Digital Visibility Strategy &amp; Roadmap</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#6D28D9;">Module 6:</strong> Long-Term Impact Measurement</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#374151;">
          Start building visibility now with the free Researcher Visibility Scorecard, the same framework the Academy is built around.
        </p>
        <a href="https://researchvy.com/resources/visibility-scorecard"
           style="display:inline-block;background:#8B5CF6;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">
          Take the Free Visibility Scorecard →
        </a>
        <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">Questions about the programme? Reply here, we read every message.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Clinic drip — Day 3 ───────────────────────────────────────────────────────

export function clinicDripDay3(): { subject: string; html: string } {
  return {
    subject: "While you wait, the one thing most researchers never fix",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">Digital Visibility Clinic</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">The one thing most researchers never fix, and it costs them everything.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">Most researchers assume their citation count is low because their work isn't reaching the right people. The real problem is that the work <em>cannot</em> reach the right people, because the systems that power scholarly discovery can't identify them as its author.</p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">This is called <strong style="color:#111827;">author disambiguation failure</strong>, and it affects an estimated 1 in 3 researchers with common surnames or multi-institutional histories.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#FEF3C7;border-left:3px solid #F59E0B;padding:20px 24px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#92400E;">What disambiguation failure looks like</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#78350F;">→ Scopus shows two profiles for you, citations split across both</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#78350F;">→ Google Scholar attributes 14 of your 38 publications to a colleague with the same initials</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#78350F;">→ ORCID is unverified, so journals can't link your publications back to you automatically</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#78350F;">→ Web of Science h-index is 4. Real h-index when duplicates are merged: 9.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;"><strong style="color:#111827;">Session 2 of the Digital Visibility Clinic is dedicated entirely to this.</strong> We audit your Scopus, Google Scholar, ORCID, and Web of Science profiles, identify every disambiguation issue, and fix them live, during the session, with you.</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#374151;">The average clinic participant recovers <strong style="color:#059669;">11 missing publications and 23 lost citations</strong> in that single session.</p>
        <a href="https://researchvy.com/clinics/digital-visibility-clinic" style="display:inline-block;background:#2563EB;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">See the Full Clinic Programme →</a>
        <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">We'll be in touch about cohort dates soon. Reply with any questions.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Clinic drip — Day 7 ───────────────────────────────────────────────────────

export function clinicDripDay7(): { subject: string; html: string } {
  return {
    subject: "Cohort update, what participants say after the clinic",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563EB;">Cohort Update</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">Here's what the last cohort looked like after Session 6.</h1>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">You're registered. We'll contact you soon with cohort dates. Here's what the process actually delivers.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#14532D;">Dr. Fatima Okonkwo · Medical Sciences</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#166534;">"My h-index went from 6 to 11 in four months. Not because I published more, but because 19 papers that were mine were finally attributed to me correctly."</p>
        </div>
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1E3A5F;">Prof. Adewale Mensah · Engineering</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#1D4ED8;">"I had no idea my ORCID wasn't synced. Three journals had cited me under a different author ID. The clinic found it in Session 2. Fixed in 20 minutes."</p>
        </div>
        <div style="background:#FDF4FF;border:1px solid #E9D5FF;border-radius:8px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#4A1772;">Dr. Sade Boateng · Social Sciences</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#7E22CE;">"The communication session changed how I explain my research completely. I got a BBC Africa interview two weeks after the clinic ended."</p>
        </div>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#F0F9FF;border-left:3px solid #2563EB;padding:20px 24px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1E3A5F;">What you'll have after Session 6</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#1D4ED8;">✓ Fully verified ORCID connected to all your publications</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#1D4ED8;">✓ Disambiguation resolved across Scopus, Google Scholar, Web of Science</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#1D4ED8;">✓ A citation growth strategy that doesn't require publishing more</p>
        <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#1D4ED8;">✓ Research communication templates for policy, media, and public audiences</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#1D4ED8;">✓ A 12-month personalised visibility roadmap</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <a href="https://researchvy.com/clinics/digital-visibility-clinic" style="display:inline-block;background:#2563EB;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Review the Full Programme →</a>
        <p style="margin:12px 0 0;font-size:13px;color:#9CA3AF;">Reply to this email any time with questions.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Academy drip — Day 3 ──────────────────────────────────────────────────────

export function academyDripDay3(): { subject: string; html: string } {
  return {
    subject: "A preview of Module 1, before your Academy cohort starts",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8B5CF6;">Research Visibility Academy</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">Module 1 starts with a question most researchers can't answer.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;"><strong style="color:#111827;">If someone searched your full name on Google Scholar right now, would they find you, or someone else?</strong></p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">Module 1, Scholar Identity and Profile Architecture, answers this definitively, then builds the structural foundation every other visibility effort depends on.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#F5F3FF;border-left:3px solid #8B5CF6;padding:20px 24px;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#4C1D95;">What you'll build in Module 1</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5B21B6;"><strong style="color:#4C1D95;">Scholar Identity Architecture:</strong> a single canonical identity that all discovery platforms recognise as uniquely you.</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5B21B6;"><strong style="color:#4C1D95;">Verified ORCID integration:</strong> connected to your institution, journals, and funding bodies so attribution flows automatically.</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#5B21B6;"><strong style="color:#4C1D95;">Profile audit report:</strong> every platform that references your work, accuracy of each record, and a priority fix list.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#374151;">Without this foundation, every other visibility effort builds on sand. We'll be in touch with cohort dates within the next few days.</p>
        <a href="https://researchvy.com/resources/visibility-scorecard" style="display:inline-block;background:#8B5CF6;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Take the Visibility Scorecard First →</a>
        <p style="margin:16px 0 0;font-size:13px;color:#9CA3AF;">Questions? Reply here.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Certificate issued ────────────────────────────────────────────────────────

export function certificateIssuedEmail(
  name: string,
  certificateNumber: string,
  programme: string,
): { subject: string; html: string } {
  const verifyUrl    = `https://researchvy.com/verify/${esc(certificateNumber)}`;
  const dashboardUrl = "https://researchvy.com/dashboard/certificates";
  const displayName  = esc(name || "Researcher");
  const safeProg     = esc(programme);
  return {
    subject: `Your Certificate of Scholarly Visibility Practice, ${certificateNumber}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your Certificate</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#10B981;">Certificate Issued</p>
        <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;color:#111827;">
          Congratulations, ${displayName}.
        </h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
          Your <strong style="color:#111827;">Certificate of Scholarly Visibility Practice</strong> has been issued for your
          successful completion of the <strong style="color:#111827;">${safeProg}</strong>.
        </p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
          Your certificate number is <strong style="color:#111827;font-family:monospace;">${esc(certificateNumber)}</strong>.
          This certificate is verifiable, downloadable, and shareable, including directly to LinkedIn.
        </p>
      </td></tr>
    </table>

    <!-- Certificate preview block -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#080E1A;border-radius:12px;padding:28px 32px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#10B981;">Researchvy</p>
        <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#9CA3AF;letter-spacing:0.04em;">Certificate of Scholarly Visibility Practice</p>
        <p style="margin:0 0 6px;font-size:11px;color:#6B7280;">This certifies that</p>
        <p style="margin:0 0 12px;font-size:22px;font-weight:700;color:#F9FAFB;">${displayName}</p>
        <p style="margin:0 0 16px;font-size:11px;color:#6B7280;">has successfully completed the</p>
        <p style="margin:0 0 20px;font-size:14px;font-weight:700;color:#2563EB;">${safeProg}</p>
        <p style="margin:0;font-size:11px;font-family:monospace;color:#4B5563;">${certificateNumber}</p>
      </td></tr>
    </table>

    <!-- Actions -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <a href="${dashboardUrl}"
           style="display:inline-block;background:#2563EB;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;margin-bottom:12px;">
          View & Download Certificate →
        </a>
        <br/>
        <a href="${verifyUrl}"
           style="display:inline-block;color:#6B7280;font-size:13px;font-weight:600;text-decoration:none;margin-top:8px;">
          Public verification: researchvy.com/verify/${certificateNumber}
        </a>
      </td></tr>
    </table>

    <!-- What to do next -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td style="background:#F0F9FF;border:1px solid #BFDBFE;border-radius:8px;padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1E3A5F;">How to use your certificate</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#1D4ED8;">LinkedIn:</strong> Add as a licence/certification: Issuing Organisation "Researchvy", Credential ID "${certificateNumber}", Credential URL: ${verifyUrl}</p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#1D4ED8;">ORCID:</strong> Add as a qualification under Education &amp; Qualifications</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#374151;"><strong style="color:#1D4ED8;">Institutional Profile:</strong> Add "Certificate of Scholarly Visibility Practice, Researchvy (${new Date().getFullYear()})" to your professional development section</p>
      </td></tr>
    </table>

    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}

// ── Academy drip — Day 7 ──────────────────────────────────────────────────────

export function academyDripDay7(): { subject: string; html: string } {
  return {
    subject: "Your Academy cohort, what the full 6 modules will do for you",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <div style="${BASE}">
    ${HEADER}
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 32px 24px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8B5CF6;">Research Visibility Academy</p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;line-height:1.3;color:#111827;">Cohort forming, here's what the next 6 modules will do for you.</h1>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">You're on the priority list. We're contacting you shortly with dates. Here's an honest breakdown of what participants gain across the full programme.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:10px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 1 · Scholar Identity</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">A single, verified identity across every discovery platform</p></div>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:10px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 2 · Discoverability</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">Every publication attributed correctly, every profile optimised</p></div>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:10px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 3 · Citation Intelligence</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">An h-index that reflects your actual output, plus an ethical growth strategy</p></div>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:10px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 4 · Research Communication</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">Your research explained to policy, media, and public audiences</p></div>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:10px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 5 · Visibility Strategy</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">A 12-month personalised roadmap with quarterly milestones</p></div>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;"><p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#8B5CF6;">Module 6 · Impact Measurement</p><p style="margin:0;font-size:13px;line-height:1.6;color:#374151;">A system for tracking and reporting your growing scholarly impact</p></div>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr><td>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#374151;">The Academy is not a course you consume, it's a structured build. By Module 6, every gap in your visibility system has been found and closed. Most participants see measurable h-index improvement within 90 days of completing.</p>
        <a href="https://researchvy.com/academy" style="display:inline-block;background:#8B5CF6;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Review the Full Programme →</a>
        <p style="margin:12px 0 0;font-size:13px;color:#9CA3AF;">We'll be in touch with cohort dates very shortly. Reply any time.</p>
      </td></tr>
    </table>
    ${TRANSACTIONAL_FOOTER}
  </div>
</body>
</html>`,
  };
}
