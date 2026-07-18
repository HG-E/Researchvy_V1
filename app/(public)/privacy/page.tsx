import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "How Researchvy collects, uses, and protects your personal data.",
  path: "/privacy",
});

const LAST_UPDATED = "22 June 2026";

const SECTION_STYLE: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderColor: "#E2E8F0",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6 sm:p-8" style={SECTION_STYLE}>
      <h2 className="text-lg font-bold mb-4" style={{ color: "#111827" }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Legal
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            Researchvy (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This policy explains
            what personal data we collect when you use researchvy.com, how we use it, and your rights
            over that data. We keep this plain and direct.
          </p>
        </div>

        <div className="space-y-4">

          <Section title="1. Who We Are">
            <p>
              Researchvy is a scholarly visibility platform offering training, clinics, resources, and
              intelligence tools for researchers and institutions. Our contact email is{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p><strong style={{ color: "#374151" }}>Account data.</strong> When you create an account, we collect your email address
              and any profile information you choose to provide (full name, institutional affiliation,
              ORCID iD, Google Scholar URL, bio).</p>
            <p><strong style={{ color: "#374151" }}>Enquiry data.</strong> When you submit a clinic, academy, or partnership enquiry, we
              collect the details you provide in the form (name, email, institution, message).</p>
            <p><strong style={{ color: "#374151" }}>Newsletter data.</strong> When you subscribe to our newsletter, we store your email
              address and the date of subscription.</p>
            <p><strong style={{ color: "#374151" }}>Usage data.</strong> We collect anonymised analytics on how visitors use the site
              (pages visited, session duration, browser type, country). This data is aggregated and
              cannot identify you individually.</p>
            <p><strong style={{ color: "#374151" }}>Cookies &amp; local storage.</strong> We use session cookies required for
              authentication. Our analytics tool (PostHog) uses browser local storage — not cookies —
              so no analytics cookie is set. Analytics tracking only activates after you give consent
              via the banner shown on your first visit.</p>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="space-y-2">
              {[
                "To provide and operate the Researchvy platform and dashboard.",
                "To process clinic and academy enquiries and contact you about your application.",
                "To send our newsletter and research visibility updates (only if you opt in).",
                "To respond to partnership enquiries from institutions.",
                "To improve our platform, content, and clinics using aggregated analytics.",
                "To send transactional emails (account confirmation, password reset).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#2563EB" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>We do not sell your personal data. Ever.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services to operate our platform:</p>
            <ul className="space-y-2 mt-2">
              {[
                { name: "Supabase", purpose: "Database, authentication, and file storage. Data stored on Supabase EU servers." },
                { name: "Resend",   purpose: "Transactional and newsletter email delivery." },
                { name: "PostHog",  purpose: "Privacy-friendly website analytics using browser local storage (not cookies). Analytics only activates after you provide consent. You can opt out at any time by declining via the consent banner or clearing your browser's local storage." },
                { name: "Cloudinary", purpose: "Image hosting for programme and content images." },
                { name: "Vercel",   purpose: "Platform hosting and infrastructure." },
              ].map(({ name, purpose }) => (
                <li key={name} className="flex items-start gap-2">
                  <strong style={{ color: "#374151", minWidth: "90px", display: "inline-block" }}>{name}</strong>
                  <span>{purpose}</span>
                </li>
              ))}
            </ul>
            <p>Each provider processes data in accordance with their own privacy policy and, where applicable, under GDPR-compliant data processing agreements.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              Account data is retained for as long as your account is active. If you delete your account,
              we will delete or anonymise your personal data within 30 days, except where retention is
              required by law.
            </p>
            <p>
              Enquiry data is retained for up to 2 years from the date of enquiry.
              Newsletter subscription data is retained until you unsubscribe.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the following rights over your personal data:</p>
            <ul className="space-y-2 mt-2">
              {[
                "Access: request a copy of the personal data we hold about you.",
                "Correction: request that we correct inaccurate or incomplete data.",
                "Deletion: request that we delete your personal data.",
                "Objection: object to us processing your data for direct marketing.",
                "Portability: request your data in a machine-readable format.",
                "Withdrawal: withdraw consent at any time where processing is based on consent.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#2563EB" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>. We respond within 30 days.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We implement industry-standard technical and organisational measures to protect your data,
              including encrypted connections (HTTPS), row-level security on our database, and
              role-based access controls. No method of transmission or storage is 100% secure; we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="8. Children">
            <p>
              Researchvy is not directed at children under 16. We do not knowingly collect personal data
              from anyone under 16. If we become aware that we have collected data from a child, we will
              delete it promptly.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this policy periodically. When we make material changes, we will update the
              &ldquo;Last updated&rdquo; date above and, where appropriate, notify registered users by email. Your
              continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about this policy? Contact us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
