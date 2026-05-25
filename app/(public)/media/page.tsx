import Link from "next/link";
import { Mic, Video, BookOpen, PenTool, ArrowRight, MessageCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "Researchvy Media",
  description: "Scholarly communication, knowledge translation, and educational content for researchers — from visual abstracts to podcast appearances and research storytelling.",
  path: "/media",
});

const SERVICES = [
  {
    icon:  PenTool,
    title: "Research Storytelling",
    desc:  "Transform your publications and findings into compelling narratives that engage both academic and public audiences. We help you articulate your research impact clearly and memorably.",
    color: "#F472B6",
  },
  {
    icon:  Video,
    title: "Visual Abstracts & Explainers",
    desc:  "Professional visual abstracts, infographics, and short-form explainer content designed for social media, conference presentations, and journal submissions.",
    color: "#60A5FA",
  },
  {
    icon:  Mic,
    title: "Podcast & Media Placement",
    desc:  "Strategic placement on academic and public podcasts, radio programmes, and science communication platforms to amplify your research beyond the journal page.",
    color: "#34D399",
  },
  {
    icon:  BookOpen,
    title: "Knowledge Translation",
    desc:  "Adapting research outputs into policy briefs, lay summaries, and public-facing content that bridges the gap between scholarly work and real-world application.",
    color: "#FCD34D",
  },
];

const FORMATS = [
  "Written lay summaries and policy briefs",
  "Visual abstracts and research infographics",
  "Short-form video scripts and explainer outlines",
  "Podcast interview preparation and placement",
  "Social media content calendars for research dissemination",
  "Press release drafting for high-impact publications",
];

export default function MediaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Media
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Your Research Is Published.<br />
            <span style={{ color: "#F472B6" }}>The World Still Can&apos;t Read It.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            Journals reach other researchers. The policymakers, practitioners, and public who
            could act on your findings read something else entirely. We translate your research
            into formats that actually reach the people who need it.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy Media services")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Discuss a Project
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              Send an Enquiry
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

        {/* Formats + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Content Formats
            </p>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What we produce
            </h2>
            <div className="space-y-3">
              {FORMATS.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#F472B6" }} />
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
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#F472B6" }}>
              Work With Us
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Start a Media Project
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Your research took years to produce. It deserves more than a PDF that nobody
              outside your field will open. Tell us what you&apos;ve published and who should
              be reading it — we&apos;ll build the content that gets it there.
            </p>
            <div className="space-y-3">
              <a
                href={buildWhatsAppUrl("Researchvy Media project")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
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

        {/* Bridge to Insights */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "rgba(244,114,182,0.05)", borderColor: "rgba(244,114,182,0.2)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
              Want to learn to communicate your research yourself?
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Our Insights hub covers scholarly communication, visibility strategy, and research storytelling.
            </p>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors hover:bg-[#BE185D]"
            style={{ backgroundColor: "#F472B6", color: "#0F172A" }}
          >
            Read Insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
