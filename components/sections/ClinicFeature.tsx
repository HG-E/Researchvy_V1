"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { copy } from "@/constants/copy";
import { siteConfig } from "@/config/site";

export function ClinicFeature() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
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
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              {copy.clinic.name}
            </h2>
            <p className="text-base mb-8" style={{ color: "#9CA3AF" }}>
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
                  style={{ color: "#D1D5DB" }}
                >
                  <CheckCircle
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    style={{ color: "#10B981" }}
                  />
                  {outcome}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/clinics"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.97]"
                style={{ backgroundColor: "#2563EB" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              >
                {copy.clinic.cta}
              </Link>
              <WhatsAppButton
                context="Digital Visibility Clinic"
                variant="outline"
                label="Enquire via WhatsApp"
              />
            </div>
          </motion.div>

          {/* Right: 5-emotion transformation card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#2563EB" }}
            >
              5-Emotion Transformation
            </p>
            {siteConfig.transformationSequence.map((item, i) => (
              <div key={i} className="flex gap-4 mb-5 last:mb-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#2563EB", color: "#fff" }}
                >
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#F9FAFB" }}>
                    {item.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t" style={{ borderColor: "#334155" }}>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Pricing is communicated upon enquiry. Use the WhatsApp button to get tailored
                information for your specific needs.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
