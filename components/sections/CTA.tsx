"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { copy } from "@/constants/copy";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { trackCtaClick } from "@/lib/analytics/posthog";

export function CTA() {
  return (
    <section
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: "radial-gradient(ellipse at center, #2563EB 0%, #7C3AED 50%, transparent 80%)" }}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#F9FAFB 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
            style={{ color: "#60A5FA" }}
          >
            Begin Your Journey
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            {copy.cta.ecosystem}
          </h2>
          <p
            className="text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            {copy.cta.body}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 w-full max-w-xs mx-auto sm:max-w-none">
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-base font-semibold text-white active:scale-[0.97]"
              style={{
                backgroundColor: "#2563EB",
                transition: "background-color 150ms ease, transform 100ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onBlur={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onClick={() => trackCtaClick(copy.clinic.cta, "homepage-cta", siteConfig.whatsapp.baseUrl)}
            >
              <MessageCircle className="h-4 w-4 flex-shrink-0" />
              {copy.clinic.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border active:scale-[0.97]"
              style={{
                color: "#CBD5E1",
                borderColor: "rgba(203,213,225,0.2)",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
                e.currentTarget.style.color = "#60A5FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(203,213,225,0.2)";
                e.currentTarget.style.color = "#CBD5E1";
              }}
              onClick={() => trackCtaClick("Explore the Ecosystem", "homepage-cta", "/ecosystem")}
            >
              Explore the Ecosystem
            </Link>
          </div>

          <p className="mt-4 text-xs" style={{ color: "#475569" }}>
            No WhatsApp?{" "}
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Clinic%20Enquiry`}
              className="font-medium transition-colors"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#60A5FA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              Email us at {siteConfig.contact.email} →
            </a>
          </p>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
            <Link
              href="/clinics/private-consulting"
              className="font-semibold transition-colors"
              style={{ color: "#A78BFA" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C4B5FD")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#A78BFA")}
            >
              Prefer 1-on-1? Private Consulting from $209 →
            </Link>
            <Link
              href="/consultation"
              className="font-semibold transition-colors"
              style={{ color: "#34D399" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6EE7B7")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#34D399")}
            >
              <Phone className="h-3 w-3 inline mr-0.5" />
              Free 20-min strategy call →
            </Link>
          </div>

          {/* Value ladder */}
          <div
            className="mt-10 rounded-2xl border p-6"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4 text-center" style={{ color: "#475569" }}>
              Your path to full visibility
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {[
                { label: "Visibility Scorecard", sub: "Free · 5 min",           color: "#10B981" },
                { label: "Academy Courses",       sub: "Self-paced · Free–paid", color: "#2563EB" },
                { label: "Digital Visibility Clinic", sub: "Live cohort · from $79", color: "#6366F1" },
                { label: "Private Consulting",    sub: "1-on-1 · From $209",    color: "#8B5CF6" },
              ].map(({ label, sub, color }, i, arr) => (
                <span key={label} className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div
                      className="rounded-xl px-3 py-2 text-xs font-semibold"
                      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}35` }}
                    >
                      {label}
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "#475569" }}>{sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-sm hidden sm:inline" style={{ color: "#1E3A5F" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Framework chain */}
          <div className="mt-10">
            <div
              className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:justify-center pb-1"
              style={{ scrollbarWidth: "none" } as React.CSSProperties}
            >
              {(siteConfig.framework as readonly string[]).map((step, i) => (
                <span key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderColor: i === siteConfig.framework.length - 1 ? "#10B98140" : "rgba(255,255,255,0.1)",
                      color: i === siteConfig.framework.length - 1 ? "#34D399" : "#64748B",
                    }}
                  >
                    {step}
                  </span>
                  {i < siteConfig.framework.length - 1 && (
                    <span className="text-sm flex-shrink-0" style={{ color: "#1E3A5F" }}>→</span>
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
