import Link from "next/link";
import { BarChart2, Search, FileSearch, Building2, ArrowRight, MessageCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "Researchvy Intelligence",
  description: "Data-driven research visibility analytics, institutional audits, and citation intelligence for researchers and institutions.",
  path: "/intelligence",
});

const SERVICES = [
  {
    icon:  BarChart2,
    title: "Visibility Analytics",
    desc:  "Comprehensive analysis of your research visibility profile across Scopus, Google Scholar, Web of Science, and ORCID. Understand where you stand and what needs attention.",
    color: "#60A5FA",
  },
  {
    icon:  FileSearch,
    title: "Citation Intelligence",
    desc:  "Deep dive into your citation profile — h-index analysis, citation patterns, co-citation mapping, and strategic recommendations for ethical citation growth.",
    color: "#A78BFA",
  },
  {
    icon:  Building2,
    title: "Institutional Audits",
    desc:  "Full-scale visibility audit for research offices and universities. Benchmark your institution's scholarly presence and build a roadmap for collective impact.",
    color: "#34D399",
  },
  {
    icon:  Search,
    title: "Discoverability Reports",
    desc:  "Assess how discoverable your research is across all major scholarly discovery systems. Get a prioritised action plan to improve your reach and indexing.",
    color: "#FCD34D",
  },
];

const DELIVERABLES = [
  "Personalised Visibility Score across key platforms",
  "Citation profile analysis with h-index breakdown",
  "Platform-by-platform discoverability gaps",
  "Competitor/peer benchmarking (optional)",
  "Written strategic recommendations report",
  "30-minute debrief call with findings",
];

export default function IntelligencePage() {
  return (
    <div style={{ backgroundColor: "#080E1A", minHeight: "100vh" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Intelligence
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Research Visibility<br />
            <span style={{ color: "#60A5FA" }}>Analytics & Audits</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            Data-driven intelligence for researchers and institutions who want to understand,
            measure, and strategically improve their scholarly visibility and research impact.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy Intelligence audit")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Request an Audit
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              Ask a Question
            </Link>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {SERVICES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <h2 className="text-base font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              What You Receive
            </p>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Every audit includes
            </h2>
            <div className="space-y-3">
              {DELIVERABLES.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#60A5FA" }} />
                  <p className="text-sm" style={{ color: "#D1D5DB" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA panel */}
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#60A5FA" }}>
              Get Started
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Request Your Visibility Audit
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Audits are conducted by our research intelligence team. Pricing is contextual
              — based on scope, whether individual or institutional, and your specific needs.
              Reach out to start the conversation.
            </p>
            <div className="space-y-3">
              <a
                href={buildWhatsAppUrl("Researchvy Intelligence audit")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Enquire via WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                Send an Email
              </Link>
            </div>
            <p className="text-xs text-center mt-4" style={{ color: "#374151" }}>
              Typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* Bridge to Clinics */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
              Want hands-on training too?
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              The Digital Visibility Clinic teaches you to interpret and act on research intelligence yourself.
            </p>
          </div>
          <Link
            href="/clinics"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors hover:bg-[#1D4ED8]"
            style={{ backgroundColor: "#2563EB", color: "#F9FAFB" }}
          >
            View Clinics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
