"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, ShieldCheck, Phone } from "lucide-react";
import { copy } from "@/constants/copy";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { trackCtaClick } from "@/lib/analytics/posthog";

export function ClinicFeature({ spotsLeft }: { spotsLeft?: number | null }) {
  const soloBundle = digitalVisibilityClinic.pricing.bundles[0];
  const isEarlyBird = new Date() < new Date(digitalVisibilityClinic.pricing.earlyBirdDeadline + "T23:59:59");
  const ngnPrice = isEarlyBird ? soloBundle.ngn.earlyBird : soloBundle.ngn.regular;
  const usdPrice = isEarlyBird ? soloBundle.usd.earlyBird : soloBundle.usd.regular;

  const urgencyColor =
    spotsLeft == null ? "#F59E0B" :
    spotsLeft <= 5    ? "#EF4444" :
    spotsLeft <= 10   ? "#F59E0B" :
    "#10B981";

  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#10B981" }}
            >
              Flagship Programme
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              {copy.clinic.name}
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              {copy.clinic.tagline}
            </p>

            <ul className="space-y-3 mb-10">
              {copy.clinic.outcomes.map((outcome, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "#374151" }}
                >
                  <CheckCircle
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    style={{ color: "#10B981" }}
                  />
                  {outcome}
                </motion.li>
              ))}
            </ul>

            {/* Urgency signal */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                style={{ backgroundColor: urgencyColor }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: urgencyColor }}
              >
                {spotsLeft != null
                  ? spotsLeft <= 0
                    ? "This cohort is full — join the waitlist"
                    : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining in the July cohort`
                  : "Limited to 20 participants per cohort, spots fill fast"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white active:scale-[0.97] active:opacity-90"
                style={{
                  backgroundColor: "#2563EB",
                  transition: "background-color 150ms ease, transform 100ms ease, opacity 100ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onFocus={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onBlur={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onClick={() => trackCtaClick(copy.clinic.cta, "clinic-feature", siteConfig.whatsapp.baseUrl)}
              >
                <MessageCircle className="h-4 w-4" />
                {copy.clinic.cta}
              </a>
              <Link
                href="/clinics"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold border active:scale-[0.97] active:opacity-80"
                style={{
                  color: "#374151",
                  borderColor: "#E2E8F0",
                  transition: "border-color 150ms ease, color 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#2563EB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#374151"; }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#2563EB"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#374151"; }}
                onClick={() => trackCtaClick("View Full Programme", "clinic-feature", "/clinics")}
              >
                View Full Programme
              </Link>
            </div>

            {/* Email fallback — Item 11 */}
            <p className="mt-3 text-xs" style={{ color: "#9CA3AF" }}>
              No WhatsApp?{" "}
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Clinic%20Enquiry`}
                className="font-medium transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                Email {siteConfig.contact.email} →
              </a>
            </p>

            {/* Risk reversal */}
            <div className="flex items-center gap-2 mt-4">
              <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Full refund guaranteed on cancellations 7+ days before cohort start.
              </p>
            </div>

            {/* Free strategy call */}
            <p className="mt-3 text-xs" style={{ color: "#6B7280" }}>
              Not sure yet?{" "}
              <Link
                href="/consultation"
                className="font-semibold transition-colors"
                style={{ color: "#10B981" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#059669")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#10B981")}
              >
                <Phone className="h-3 w-3 inline mr-1" />
                Book a free 20-min strategy call first →
              </Link>
            </p>

            {/* Enrollment steps */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#6B7280" }}>
                How enrollment works
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { step: "1", label: "Message us on WhatsApp", detail: "Tell us your research stage and goals" },
                  { step: "2", label: "We confirm your spot", detail: "Within 3–5 business days, cohort details sent to your email" },
                  { step: "3", label: "Cohort starts", detail: "Live sessions begin — small group, expert-led, fully interactive" },
                ].map(({ step, label, detail }) => (
                  <div key={step} className="flex items-start gap-3 flex-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(37,99,235,0.10)", color: "#2563EB" }}
                    >
                      {step}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#374151" }}>{label}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "#6B7280" }}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: 5-emotion transformation card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
          >
            {/* Gradient top accent bar */}
            <div className="h-0.5" style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }} />

            <div className="p-8">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <p
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#2563EB" }}
                >
                  5-Emotion Transformation
                </p>
                <span
                  className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(16,185,129,0.10)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#10B981" }}
                  />
                  Enrolling Now
                </span>
              </div>

              {siteConfig.transformationSequence.map((item, i) => (
                <div key={i} className="flex gap-4 mb-5 last:mb-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#2563EB", color: "#fff" }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: "#111827" }}>
                      {item.label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t" style={{ borderColor: "#E2E8F0" }}>
                <p className="text-xs mb-2" style={{ color: "#6B7280" }}>
                  From{" "}
                  <strong style={{ color: "#111827" }}>${usdPrice} USD</strong>
                  {" / "}
                  <strong style={{ color: "#10B981" }}>₦{ngnPrice.toLocaleString("en-NG")} NGN</strong>
                  {isEarlyBird ? " · Early bird pricing." : " per module."}
                </p>
                {/* ROI anchor — Item 14 */}
                <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "#9CA3AF" }}>
                  One successful grant application returns this investment 50× over.
                  One promotion cycle with a higher h-index compounds for a career.
                </p>
                <Link
                  href="/clinics#pricing"
                  className="text-xs font-semibold"
                  style={{ color: "#2563EB" }}
                >
                  See full pricing &amp; tiers →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
