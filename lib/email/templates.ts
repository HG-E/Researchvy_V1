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
            The average researcher has no idea how visible — or invisible — their work actually
            is. They assume citations are slow because the field is small, or the journal
            wasn't prestigious enough, or their timing was off.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            Almost always, the real reason is simpler: <strong style="color:#111827;">the discovery systems
            that researchers use to find work simply cannot find yours.</strong>
          </p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
            Not because your research isn't good enough. Because your visibility is broken —
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
            Dr. Amara Osei — 51 publications. h-index of 3.
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
            If those numbers don't match — and for most researchers, they don't —
            <strong style="color:#111827;">your work is invisible to everyone searching for it.</strong>
            That's the most common gap the audit finds. And it's one of the fastest to fix.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;font-style:italic;">
            Over the next few days, we'll send you a full 5-point visibility self-check and
            a breakdown of exactly what the Digital Visibility Clinic covers — session by session.
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
            at least two of them — and have no idea. Take 5 minutes now.
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
              title: "Google Scholar — is it complete?",
              check: "Open your Google Scholar profile. Count the publications listed. Does it match everything you've published? Are your name variants covered? Is your institutional email verified?",
              fail: "Missing publications means you're invisible in Google's academic search — the first place most researchers look.",
            },
            {
              n: "2",
              title: "ORCID — is it verified and populated?",
              check: "Log into orcid.org. Are all your works claimed? Is your iD verified (green tick)? Have you connected your institutional affiliation?",
              fail: "Without a verified ORCID, journals and indexing systems cannot programmatically attribute your work to you.",
            },
            {
              n: "3",
              title: "Scopus — one profile or two?",
              check: "Search your name on Scopus. If you see two author profiles, your citation count is split. This directly suppresses your h-index.",
              fail: "Duplicate Scopus IDs are one of the most common and most damaging visibility problems — and completely fixable.",
            },
            {
              n: "4",
              title: "Research keywords — do they match what your field searches?",
              check: "Look at the keywords on your profiles and in your paper abstracts. Are they the terms other researchers actually type when looking for work in your area?",
              fail: "Mismatched keywords mean your papers don't surface in discovery system searches — even when they're directly relevant.",
            },
            {
              n: "5",
              title: "Institutional profile — updated in the last 12 months?",
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
            work can't find it — not because they don't want to, but because the systems
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
            Want a professional audit that covers all five areas — and gives you a
            prioritised fix list with specific actions?
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
    subject: "6 sessions. Here's what changes.",
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
            Six sessions.<br/>One complete transformation.
          </h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
            Dr. Amara Osei had 51 publications and an h-index of 3. After 6 sessions:
            <strong style="color:#059669;">h-index 3 → 7. Citations 28 → 94.</strong>
            Four months. The research didn't change. The visibility did.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">
            Here's exactly what those 6 sessions cover:
          </p>
        </td>
      </tr>
    </table>

    <!-- Sessions -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
      <tr>
        <td>
          ${[
            { n: "01", title: "Visibility Foundations", desc: "Why researchers stay invisible — and the system that changes it." },
            { n: "02", title: "Digital Identity Systems", desc: "Google Scholar, ORCID, Scopus — fully set up, verified, and linked." },
            { n: "03", title: "Discoverability Optimisation", desc: "Keyword strategy, indexing, Open Access — get your work ranked." },
            { n: "04", title: "Citation Intelligence", desc: "Your h-index, citation patterns, and an ethical strategy to move both." },
            { n: "05", title: "Research Communication", desc: "Translate your findings for policymakers, practitioners, and the public." },
            { n: "06", title: "Strategic Positioning & Impact", desc: "Your personal visibility roadmap — built to run without you having to think about it." },
          ].map(({ n, title, desc }) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <span style="display:inline-block;width:28px;height:28px;background:#EFF6FF;border-radius:6px;text-align:center;line-height:28px;font-size:11px;font-weight:700;color:#2563EB;">${n}</span>
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
            "A clear, measurable baseline — so you can track exactly what moves",
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
            biggest visibility challenge — where you feel most stuck or most invisible.
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
