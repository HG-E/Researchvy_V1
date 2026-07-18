"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const OBJECTIONS = [
  {
    q: "I'm already too busy to add anything else",
    a: "The clinic is 5 sessions — 10 hours total. That's less than most researchers spend in a single week of unread email. Most attendees say it's the highest-leverage 10 hours they've spent in years.",
  },
  {
    q: "Visibility feels less important than just publishing more",
    a: "Funders and promotion panels use citation counts and discoverability as proxies for impact — before they read your papers. Publishing more into the void compounds the same problem.",
  },
  {
    q: "Can't I find this information online for free?",
    a: "Parts of it, scattered across hundreds of posts with no framework and no accountability. The clinic gives you a structured audit of your specific profile, not generic advice you have to translate yourself.",
  },
  {
    q: "I'm not sure this applies to my field",
    a: "We've worked with researchers across STEM, public health, humanities, law, and social sciences. If you publish, get cited, or compete for grants — this applies. Field is irrelevant; the visibility infrastructure is the same.",
  },
  {
    q: "What if I don't see results?",
    a: "Apply the framework. If your visibility metrics haven't moved in 90 days, we work with you again at no charge. We're accountable to measurable outcomes, not just attendance.",
  },
  {
    q: "My institution is already supporting my research profile",
    a: "Institutional support covers publication processes. It rarely touches Google Scholar optimisation, ORCID completeness, Scopus indexing, or the cross-platform signals that drive actual discoverability.",
  },
];

export function ObjectionBuster() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Common Questions
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            We&apos;ve Heard Every Hesitation.
            <br />
            <span style={{ color: "#2563EB" }}>Here&apos;s the honest answer.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {OBJECTIONS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="rounded-2xl border p-5 sm:p-6"
              style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#2563EB" }} />
                <p className="text-sm font-semibold leading-snug" style={{ color: "#111827" }}>
                  &ldquo;{item.q}&rdquo;
                </p>
              </div>
              <p className="text-sm leading-relaxed pl-7" style={{ color: "#6B7280" }}>
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
