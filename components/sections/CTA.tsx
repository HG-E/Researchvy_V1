"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { copy } from "@/constants/copy";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { trackCtaClick } from "@/lib/analytics/posthog";

export function CTA() {
  return (
    <section
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, #7C3AED 0%, #2563EB 40%, #10B981 80%, transparent 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#2563EB" }}
          >
            Begin Your Journey
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            {copy.cta.ecosystem}
          </h2>
          <p
            className="text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            {copy.cta.body}
          </p>

          <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 w-full max-w-xs mx-auto sm:max-w-none">
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white active:scale-[0.97] active:opacity-90"
              style={{
                backgroundColor: "#2563EB",
                transition: "background-color 150ms ease, transform 100ms ease, opacity 100ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onBlur={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onClick={() => trackCtaClick(copy.clinic.cta, "homepage-cta", siteConfig.whatsapp.baseUrl)}
            >
              <MessageCircle className="h-4 w-4" />
              {copy.clinic.cta}
            </a>
            <Link
              href="/ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border active:scale-[0.97] active:opacity-80"
              style={{
                color: "#374151",
                borderColor: "#E2E8F0",
                transition: "border-color 150ms ease, color 150ms ease, transform 100ms ease, opacity 100ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.color = "#2563EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#374151";
              }}
              onClick={() => trackCtaClick("Explore the Ecosystem", "homepage-cta", "/ecosystem")}
            >
              Explore the Ecosystem
            </Link>
          </div>
          <p className="mt-4 text-xs" style={{ color: "#9CA3AF" }}>
            No WhatsApp?{" "}
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Clinic%20Enquiry`}
              className="font-medium transition-colors"
              style={{ color: "#6B7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              Email us at {siteConfig.contact.email} →
            </a>
          </p>

          <p className="mt-5 text-sm" style={{ color: "#6B7280" }}>
            Prefer 1-on-1?{" "}
            <Link
              href="/clinics/private-consulting"
              className="font-semibold transition-colors"
              style={{ color: "#8B5CF6" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7C3AED")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8B5CF6")}
            >
              View Private Consulting — from $209 →
            </Link>
          </p>
          <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
            Not ready to commit?{" "}
            <Link
              href="/consultation"
              className="font-semibold transition-colors"
              style={{ color: "#10B981" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#10B981")}
            >
              <Phone className="h-3 w-3 inline mr-0.5" />
              Book a free 20-min strategy call →
            </Link>
          </p>

          {/* Value ladder */}
          <div className="mt-10 rounded-2xl border p-6" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4 text-center" style={{ color: "#6B7280" }}>
              Your path to full visibility
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {[
                { label: "Visibility Scorecard", sub: "Free · 5 min", color: "#10B981" },
                { label: "Academy Courses", sub: "Self-paced · Free–paid", color: "#2563EB" },
                { label: "Digital Visibility Clinic", sub: "Live cohort · from $79", color: "#6366F1" },
                { label: "Private Consulting", sub: "1-on-1 · From $209", color: "#8B5CF6" },
              ].map(({ label, sub, color }, i, arr) => (
                <span key={label} className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div
                      className="rounded-xl px-3 py-2 text-xs font-semibold"
                      style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}25` }}
                    >
                      {label}
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "#6B7280" }}>{sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-sm hidden sm:inline" style={{ color: "#CBD5E1" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Framework chain */}
          <div className="mt-16 relative">
            <div
              className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:justify-center pb-1"
              style={{ scrollbarWidth: "none" } as React.CSSProperties}
            >
              {(siteConfig.framework as readonly string[]).map((step, i) => (
                <span key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap"
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderColor: i === siteConfig.framework.length - 1 ? "#10B981" : "#E2E8F0",
                      color: i === siteConfig.framework.length - 1 ? "#10B981" : "#6B7280",
                    }}
                  >
                    {step}
                  </span>
                  {i < siteConfig.framework.length - 1 && (
                    <span className="text-sm flex-shrink-0" style={{ color: "#2563EB" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
