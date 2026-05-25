import Link from "next/link";
import { Building2, GraduationCap, BookOpen, Handshake, ArrowRight, MessageCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { PartnershipForm } from "@/components/partnerships/PartnershipForm";

export const metadata = generatePageMetadata({
  title: "Researchvy Partnerships",
  description: "Institutional and organisational partnerships with Researchvy — bringing research visibility training, intelligence, and media services to universities and research institutions.",
  path: "/partnerships",
});

const PARTNER_TYPES = [
  {
    icon:  Building2,
    title: "Universities & Research Offices",
    desc:  "We partner with research offices, postgraduate directorates, and academic departments to deliver visibility training, institutional audits, and bespoke programmes for staff and students.",
    color: "#60A5FA",
  },
  {
    icon:  GraduationCap,
    title: "Postgraduate Colleges & Schools",
    desc:  "Doctoral and postdoctoral programmes that embed Researchvy Academy content into their professional development curriculum — from orientation to graduation and beyond.",
    color: "#A78BFA",
  },
  {
    icon:  BookOpen,
    title: "Learned Societies & Associations",
    desc:  "Collaborations with professional and learned societies to provide members with access to visibility resources, clinics, and intelligence — at preferred rates.",
    color: "#34D399",
  },
  {
    icon:  Handshake,
    title: "Publishers & Platforms",
    desc:  "Strategic partnerships with open-access publishers, preprint platforms, and scholarly communication tools to integrate Researchvy expertise into researcher-facing workflows.",
    color: "#FCD34D",
  },
];

const WHAT_WE_OFFER = [
  "Bespoke Academy programme delivery for institutional cohorts",
  "Institutional visibility audits and benchmarking reports",
  "Discounted clinic access for staff and postgraduate students",
  "White-labelled research visibility resources",
  "Co-developed professional development frameworks",
  "Keynote and workshop facilitation at institutional events",
];

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Partnerships
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Make Research Visibility<br />
            <span style={{ color: "#60A5FA" }}>A Shared Institutional Asset.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            Individual researchers can&apos;t build visibility infrastructure alone — institutions can.
            We partner with universities, learned societies, and publishers to embed
            scholarly visibility training, audits, and intelligence into the workflows your researchers already use.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy institutional partnership")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Discuss a Partnership
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

        {/* Partner types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {PARTNER_TYPES.map(({ icon: Icon, title, desc, color }) => (
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

        {/* What we offer + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Partnership Offerings
            </p>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What partners access
            </h2>
            <div className="space-y-3">
              {WHAT_WE_OFFER.map((item) => (
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

          {/* CTA panel — real enquiry form */}
          <PartnershipForm />
        </div>

        {/* Bridge to Intelligence */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
              Need institutional-level visibility data first?
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Our Intelligence team conducts full-scale institutional audits before or alongside a partnership engagement.
            </p>
          </div>
          <Link
            href="/intelligence"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors hover:bg-[#1D4ED8]"
            style={{ backgroundColor: "#2563EB", color: "#F9FAFB" }}
          >
            View Intelligence <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
