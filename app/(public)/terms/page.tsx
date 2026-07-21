import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of Researchvy, our platform, clinics, and services.",
  path: "/terms",
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
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#4B5563" }}>
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "#4B5563" }}>Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Researchvy website
            at researchvy.com and all associated services, programmes, and content. By accessing or
            using Researchvy, you agree to be bound by these Terms. If you do not agree, do not use
            our platform.
          </p>
        </div>

        <div className="space-y-4">

          <Section title="1. About Researchvy">
            <p>
              Researchvy is a scholarly visibility platform providing training clinics, learning programmes,
              resources, and analytics tools to help researchers and institutions improve their scholarly
              visibility, discoverability, and research impact.
            </p>
          </Section>

          <Section title="2. Accounts">
            <p>
              To access certain features (dashboard, clinic enrolment, resources), you must create an
              account. You agree to:
            </p>
            <ul className="space-y-2 mt-2">
              {[
                "Provide accurate, current, and complete information when registering.",
                "Keep your password secure and not share it with others.",
                "Notify us immediately of any unauthorised access to your account.",
                "Accept responsibility for all activity under your account.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#2563EB" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or that
              we reasonably suspect are being used fraudulently.
            </p>
          </Section>

          <Section title="3. Clinic and Programme Participation">
            <p>
              Researchvy Clinics are live, cohort-based programmes with limited seats (≤20 participants per cohort).
              By submitting a clinic enquiry or enrolling, you agree to:
            </p>
            <ul className="space-y-2 mt-2">
              {[
                "Participate actively and respectfully in all sessions.",
                "Not share session recordings, materials, or resources outside your cohort without our written consent.",
                "Honour the scheduled session times, we cannot offer makeup sessions for missed classes without prior arrangement.",
                "Maintain confidentiality of discussions shared by other participants.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#2563EB" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Pricing for clinics and programmes is shared via direct enquiry. All pricing is confirmed
              in writing before enrolment is finalised.
            </p>
          </Section>

          <Section title="4. Cancellation and Refunds">
            <p>
              Cancellations made more than 7 days before a programme begins are eligible for a full
              refund. Cancellations within 7 days of the start date are non-refundable but may be
              transferred to a future cohort at our discretion.
            </p>
            <p>
              Researchvy reserves the right to reschedule or cancel a programme cohort. In such cases,
              enrolled participants will receive a full refund or the option to transfer to the next
              available cohort.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content on Researchvy, including but not limited to course materials, scorecard tools,
              articles, templates, and branding, is owned by Researchvy or its licensors and is
              protected by copyright.
            </p>
            <p>
              You may use free resources (guides, checklists, scorecards) for personal, non-commercial
              research and professional development. You may not reproduce, distribute, sell, or create
              derivative works from Researchvy content without our written permission.
            </p>
            <p>
              Researchvy certificates issued to participants are personal and non-transferable. They
              may be shared publicly (LinkedIn, academic profiles) to represent your completion of the
              programme.
            </p>
          </Section>

          <Section title="6. Acceptable Use">
            <p>You agree not to use Researchvy to:</p>
            <ul className="space-y-2 mt-2">
              {[
                "Violate any applicable law or regulation.",
                "Impersonate another person or misrepresent your academic credentials.",
                "Scrape, harvest, or systematically extract data from the platform.",
                "Upload or transmit harmful, defamatory, or offensive content.",
                "Interfere with or disrupt the platform's infrastructure.",
                "Share login credentials or grant unauthorised access to paid content.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#2563EB" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. Newsletter and Communications">
            <p>
              By subscribing to our newsletter, you consent to receive periodic emails about research
              visibility, new resources, and programme announcements. Every email includes an
              unsubscribe link. You can also opt out at any time by emailing{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>.
            </p>
            <p>
              We do not send unsolicited commercial email. Transactional emails (account verification,
              password reset, enrolment confirmation) are sent regardless of newsletter preference as
              they are necessary for the service.
            </p>
          </Section>

          <Section title="8. Disclaimers">
            <p>
              Researchvy provides training, tools, and guidance to improve scholarly visibility. We do
              not guarantee specific outcomes, including citation increases, h-index growth, or career
              advancement, as these depend on factors outside our control.
            </p>
            <p>
              The platform is provided &ldquo;as is&rdquo; without warranties of any kind, either express or
              implied. We do not warrant that the platform will be error-free, uninterrupted, or free
              of security vulnerabilities.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Researchvy shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the platform or
              participation in our programmes, even if we have been advised of the possibility of such
              damages.
            </p>
            <p>
              Our total liability to you for any claim arising from these Terms or your use of
              Researchvy shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes
              shall first be addressed through good-faith negotiation. Contact us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>{" "}
              to initiate any dispute resolution process.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Material changes will be communicated by
              updating the &ldquo;Last updated&rdquo; date above and, where appropriate, by notifying registered
              users by email. Continued use of the platform after changes constitutes acceptance of the
              updated Terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about these Terms? Email us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`} style={{ color: "#60A5FA" }}>
                {siteConfig.contact.email}
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" style={{ color: "#60A5FA" }}>
                contact page
              </Link>.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
