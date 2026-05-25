"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, AlertCircle, CheckCircle2, Quote } from "lucide-react";
import { buildWhatsAppUrl } from "@/config/site";
import { MessageCircle } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

const BEFORE_METRICS = [
  { label: "h-index",                                  value: "3",           note: "After 8 years of publishing" },
  { label: "Total citations",                           value: "28",          note: "Across all platforms" },
  { label: "Publications on Google Scholar",            value: "34 of 51",    note: "17 missing — never claimed" },
  { label: "ORCID status",                              value: "Unclaimed",   note: "Works not linked to profile" },
  { label: "Scopus profiles",                           value: "2 duplicates",note: "Citations split across two IDs" },
  { label: "International collaborations",              value: "0",           note: "In the previous 3 years" },
];

const AFTER_METRICS = [
  { label: "h-index",                                  value: "7",              delta: "+4",     note: "4 months after the clinic" },
  { label: "Total citations",                           value: "94",             delta: "+66",    note: "Across all platforms" },
  { label: "Publications on Google Scholar",            value: "51 of 51",       delta: "100%",   note: "All works claimed and verified" },
  { label: "ORCID status",                              value: "Verified",       delta: "✓",      note: "All 51 works linked" },
  { label: "Scopus profiles",                           value: "1 unified",      delta: "Merged", note: "Full citation record consolidated" },
  { label: "International collaborations",              value: "3 invitations",  delta: "New",    note: "Including 1 keynote invitation" },
];

const AUDIT_FINDINGS = [
  "17 publications not appearing on her Google Scholar profile — never discovered by the field",
  "2 conflicting Scopus author IDs splitting her citation count in half",
  "ORCID iD unverified — journals couldn't programmatically link her work",
  "No institutional repository record updated since 2020",
  "Research keywords not matching the terms her field actually searches for",
  "Zero presence on ResearchGate — where 20M+ researchers find related work",
];

const TURNING_POINTS = [
  {
    session: "Session 2",
    title:   "Digital Identity Systems",
    action:  "Claimed all 17 missing Google Scholar publications. Merged 2 Scopus author IDs into one verified profile.",
    color:   "#60A5FA",
  },
  {
    session: "Session 3",
    title:   "Discoverability Optimisation",
    action:  "Rewrote research keyword metadata across all platforms to match her field's actual search behaviour.",
    color:   "#A78BFA",
  },
  {
    session: "Session 4",
    title:   "Citation Intelligence",
    action:  "Identified 9 high-impact papers that were uncited because they weren't indexed correctly. Fixed within 48 hours.",
    color:   "#34D399",
  },
];

export function CaseStudy() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 sm:mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Real Researcher · Real Results
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            8 Years Publishing.
            <br />
            <span style={{ color: "#EF4444" }}>Almost Nobody Was Finding Her.</span>
          </h2>
          <p className="text-base max-w-2xl leading-relaxed" style={{ color: "#6B7280" }}>
            Dr. Amara Osei had 51 peer-reviewed publications and an h-index of 3.
            She assumed citations were slow because her field was small. The audit
            told a different story entirely.
          </p>
        </motion.div>

        {/* Researcher profile bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-5 mb-8 sm:mb-10 flex flex-wrap gap-4 sm:gap-6 items-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#60A5FA" }}
          >
            AO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold" style={{ color: "#F9FAFB" }}>Dr. Amara Osei</p>
            <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>Senior Lecturer · Public Health · 8 years post-PhD</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {[
              { label: "Publications", value: "51" },
              { label: "Field", value: "Public Health" },
              { label: "Programme", value: "Clinic" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
                <p className="text-xs" style={{ color: "#4B5563" }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audit findings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10"
          style={{ backgroundColor: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#EF4444" }} />
            <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>What the Visibility Audit Found</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUDIT_FINDINGS.map((finding, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB" }}>
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#EF4444" }} />
                {finding}
              </div>
            ))}
          </div>
          <p className="text-sm mt-6 pt-5 border-t leading-relaxed" style={{ borderColor: "rgba(239,68,68,0.15)", color: "#6B7280" }}>
            The problem wasn&apos;t her research quality. It was that the discovery systems her field
            uses couldn&apos;t find her — because her identity across platforms was fragmented,
            incomplete, and unverified. None of this was visible to her until the audit.
          </p>
        </motion.div>

        {/* Before / After — mobile: tab toggle | desktop: side-by-side */}
        {/* Mobile tab toggle */}
        <div className="lg:hidden mb-8">
          <div
            className="flex rounded-2xl overflow-hidden border mb-4"
            style={{ borderColor: "#1E293B" }}
          >
            <button
              className="flex-1 py-3.5 text-sm font-bold transition-all duration-200"
              style={{
                backgroundColor: activeTab === "before" ? "rgba(239,68,68,0.15)" : "#0F172A",
                color:           activeTab === "before" ? "#EF4444" : "#4B5563",
                borderRight:     "1px solid #1E293B",
              }}
              onClick={() => setActiveTab("before")}
            >
              Before — Week 1
            </button>
            <button
              className="flex-1 py-3.5 text-sm font-bold transition-all duration-200"
              style={{
                backgroundColor: activeTab === "after" ? "rgba(16,185,129,0.15)" : "#0F172A",
                color:           activeTab === "after" ? "#10B981" : "#4B5563",
              }}
              onClick={() => setActiveTab("after")}
            >
              After — 4 Months
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "before" ? (
              <motion.div
                key="before"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#EF4444" }}>
                  Before — Week 1 of Clinic
                </p>
                <div className="space-y-4">
                  {BEFORE_METRICS.map(({ label, value, note }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{note}</p>
                      </div>
                      <p className="text-sm font-bold flex-shrink-0" style={{ color: "#EF4444" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="after"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#0F172A", borderColor: "rgba(16,185,129,0.3)" }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#10B981" }}>
                  After — 4 Months Post-Clinic
                </p>
                <div className="space-y-4">
                  {AFTER_METRICS.map(({ label, value, delta, note }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{note}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
                        >
                          {delta}
                        </span>
                        <p className="text-sm font-bold" style={{ color: "#10B981" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Before / After side-by-side */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#EF4444" }}>
              Before — Week 1 of Clinic
            </p>
            <div className="space-y-4">
              {BEFORE_METRICS.map(({ label, value, note }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{note}</p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0" style={{ color: "#EF4444" }}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "rgba(16,185,129,0.3)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#10B981" }}>
              After — 4 Months Post-Clinic
            </p>
            <div className="space-y-4">
              {AFTER_METRICS.map(({ label, value, delta, note }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{note}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
                    >
                      {delta}
                    </span>
                    <p className="text-sm font-bold" style={{ color: "#10B981" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* The Turning Point — mobile: swipe carousel | desktop: 3-col grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#2563EB" }}>
            The Turning Point
          </p>

          {/* Desktop: 3-col */}
          <div className="hidden sm:grid grid-cols-3 gap-4">
            {TURNING_POINTS.map(({ session, title, action, color }) => (
              <div
                key={session}
                className="rounded-xl p-4 border"
                style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
              >
                <p className="text-xs font-semibold mb-0.5" style={{ color }}>{session}</p>
                <p className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>{action}</p>
              </div>
            ))}
          </div>

          {/* Mobile: swipe carousel */}
          <MobileCarousel
            className="sm:hidden"
            items={TURNING_POINTS.map(({ session, title, action, color }) => (
              <div
                key={session}
                className="rounded-xl p-4 border mx-0.5"
                style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color }}>{session}</p>
                <p className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{action}</p>
              </div>
            ))}
          />
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10"
          style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <Quote className="h-6 w-6 mb-5" style={{ color: "#2563EB" }} />
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: "#D1D5DB" }}>
            &ldquo;I had published consistently for eight years and assumed my citation count was low
            because public health in my region isn&apos;t well represented in global databases.
            The audit showed me the real reason: my work wasn&apos;t discoverable. Half my publications
            weren&apos;t even showing up when someone searched my name. That was the moment I understood
            that visibility isn&apos;t automatic — it&apos;s a skill. The clinic taught me that skill.
            Four months later, my h-index has moved for the first time since I started publishing.&rdquo;
          </p>
          <div className="flex items-start sm:items-center gap-4 pt-5 border-t flex-wrap sm:flex-nowrap" style={{ borderColor: "rgba(37,99,235,0.15)" }}>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#60A5FA" }}
            >
              AO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Dr. Amara Osei</p>
              <p className="text-xs" style={{ color: "#4B5563" }}>Senior Lecturer · Public Health · Digital Visibility Clinic alumna</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <CheckCircle2 className="h-4 w-4" style={{ color: "#10B981" }} />
              <span className="text-xs font-medium" style={{ color: "#10B981" }}>Certificate Holder</span>
            </div>
          </div>
        </motion.div>

        {/* Outcome summary + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" style={{ color: "#10B981" }} />
              <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
                h-index: 3 → 7 &nbsp;·&nbsp; Citations: 28 → 94 &nbsp;·&nbsp; 4 months.
              </p>
            </div>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              This is what visibility looks like when the gaps are closed. Your numbers are waiting for the same thing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors active:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Claim My Spot
            </a>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border transition-colors active:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              See the Full Programme <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
