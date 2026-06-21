/**
 * WhatsApp Business notifications via Africa's Talking.
 *
 * SETUP (free tier — 5 min):
 * 1. Register at https://africastalking.com (free)
 * 2. Go to Settings → API Keys → copy your API key
 * 3. Add to .env.local and Vercel env vars:
 *    AFRICAS_TALKING_API_KEY=your_key
 *    AFRICAS_TALKING_USERNAME=sandbox   (use "sandbox" for testing, your username for production)
 *    AFRICAS_TALKING_WHATSAPP_SENDER=+234XXXXXXXXXX  (your registered WhatsApp Business number)
 *
 * When env vars are absent, all functions silently no-op — zero risk of crashes.
 *
 * Africa's Talking free sandbox: https://simulator.africastalking.com
 * WhatsApp Business pricing: https://africastalking.com/sms (WAP section)
 */

const AT_API_KEY  = process.env.AFRICAS_TALKING_API_KEY;
const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME ?? "sandbox";
const AT_SENDER   = process.env.AFRICAS_TALKING_WHATSAPP_SENDER;
const AT_BASE     = "https://content.africastalking.com/version1/messaging/whatsapp";

interface WaSendResult { success: boolean; error?: string }

async function sendWa(to: string, body: string): Promise<WaSendResult> {
  if (!AT_API_KEY || !AT_SENDER) {
    // Graceful no-op — WhatsApp not configured, email is the fallback
    return { success: false, error: "WhatsApp not configured" };
  }

  // Normalise phone — AT expects E.164 (e.g. +2348012345678)
  const phone = to.startsWith("+") ? to : `+${to}`;

  try {
    const res = await fetch(AT_BASE, {
      method:  "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "apiKey":        AT_API_KEY,
        "Accept":        "application/json",
      },
      body: new URLSearchParams({
        username: AT_USERNAME,
        to:       phone,
        message:  body,
        from:     AT_SENDER,
      }).toString(),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { success: false, error: `AT HTTP ${res.status}: ${text}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

// ── Notification triggers ─────────────────────────────────────────────────────

/** Sent when admin marks order as payment_submitted (manual bank transfer received) */
export async function notifyPaymentReceived(opts: {
  phone:       string | null;
  userName:    string;
  orderNumber: string;
  reference:   string;
}): Promise<void> {
  if (!opts.phone) return;
  const msg =
    `Hi ${opts.userName.split(" ")[0]}, ✅ Researchvy received your payment notification for order ${opts.orderNumber}.\n\n` +
    `Your bank reference: ${opts.reference}\n\n` +
    `Our team will verify and confirm your enrollment within *2 business hours*. ` +
    `You'll get another message here when it's done. 🎓`;
  const { error } = await sendWa(opts.phone, msg);
  if (error) console.error("[whatsapp] paymentReceived:", error);
}

/** Sent when admin confirms enrollment */
export async function notifyEnrollmentConfirmed(opts: {
  phone:       string | null;
  userName:    string;
  orderNumber: string;
  bundleName:  string;
  dashboardUrl: string;
}): Promise<void> {
  if (!opts.phone) return;
  const msg =
    `🎉 Congratulations, ${opts.userName.split(" ")[0]}!\n\n` +
    `Your enrollment in the *Digital Visibility Clinic* (${opts.bundleName}) is confirmed. ` +
    `Order ${opts.orderNumber}.\n\n` +
    `👉 Check your dashboard: ${opts.dashboardUrl}\n\n` +
    `A cohort prep email is on its way. Welcome to the programme! 🚀`;
  const { error } = await sendWa(opts.phone, msg);
  if (error) console.error("[whatsapp] enrollmentConfirmed:", error);
}

/** Sent when a certificate is issued */
export async function notifyCertificateReady(opts: {
  phone:             string | null;
  userName:          string;
  certificateNumber: string;
  verifyUrl:         string;
}): Promise<void> {
  if (!opts.phone) return;
  const msg =
    `🏆 ${opts.userName.split(" ")[0]}, your Researchvy certificate is ready!\n\n` +
    `Certificate: *${opts.certificateNumber}*\n\n` +
    `Verify & share it here: ${opts.verifyUrl}\n\n` +
    `Add it to your LinkedIn and ORCID profiles directly from that page. Well done! 🌍`;
  const { error } = await sendWa(opts.phone, msg);
  if (error) console.error("[whatsapp] certificateReady:", error);
}

/** Sent to admin when a high-intent scorecard lead claims their email (score < 65) */
export async function notifyScorecardLead(opts: {
  name:  string;
  email: string;
  score: number;
  tier:  string;
}): Promise<void> {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE ?? "2347030515183";
  const tierEmoji: Record<string, string> = {
    invisible:        "🔴",
    significant_gaps: "🟠",
    emerging:         "🟡",
    leader:           "🟢",
  };
  const emoji = tierEmoji[opts.tier] ?? "📊";
  const msg =
    `${emoji} *New Scorecard Lead* — ${opts.name}\n\n` +
    `Score: *${opts.score}/100* (${opts.tier.replace("_", " ")})\n` +
    `Email: ${opts.email}\n\n` +
    `This researcher has gaps we can directly address. Reach out now while intent is high 🎯\n\n` +
    `Admin: https://researchvy.com/admin/scorecard`;
  const { error } = await sendWa(adminPhone, msg);
  if (error) console.error("[whatsapp] scorecardLead:", error);
}

/** Session reminder (2 hrs before) */
export async function notifySessionReminder(opts: {
  phone:        string | null;
  userName:     string;
  sessionNum:   number;
  sessionTitle: string;
  sessionTime:  string;
  sessionLink:  string;
}): Promise<void> {
  if (!opts.phone) return;
  const msg =
    `⏰ Reminder, ${opts.userName.split(" ")[0]}!\n\n` +
    `*Session ${opts.sessionNum}: ${opts.sessionTitle}* starts in 2 hours at *${opts.sessionTime} WAT*.\n\n` +
    `Join link: ${opts.sessionLink}\n\n` +
    `Have your ORCID and Google Scholar profiles open ready to go. See you there! 📚`;
  const { error } = await sendWa(opts.phone, msg);
  if (error) console.error("[whatsapp] sessionReminder:", error);
}
