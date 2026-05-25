import Link from "next/link";
import { Users, Globe, Award, Handshake, ArrowRight, MessageCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { HoverCard } from "@/components/ui/HoverCard";

export const metadata = generatePageMetadata({
  title: "Researchvy Network",
  description: "A global community of researchers, fellows, and visibility champions committed to advancing scholarly presence and research impact.",
  path: "/network",
});

const PILLARS = [
  {
    icon:  Users,
    title: "Peer Community",
    desc:  "Connect with researchers at every career stage across disciplines and continents. Share challenges, strategies, and successes in a focused community built around visibility and impact.",
    color: "#34D399",
  },
  {
    icon:  Award,
    title: "Fellows Programme",
    desc:  "Our Fellows are researchers who have completed advanced training and are committed to championing scholarly visibility within their institutions and disciplines.",
    color: "#60A5FA",
  },
  {
    icon:  Globe,
    title: "Global Reach",
    desc:  "Members across Africa, Europe, Asia, and the Americas, a genuinely international network that reflects the global nature of research and scholarly communication.",
    color: "#A78BFA",
  },
  {
    icon:  Handshake,
    title: "Collaborative Projects",
    desc:  "Network members get early access to collaborative research visibility projects, co-authorship opportunities, and joint initiatives with Researchvy and partner institutions.",
    color: "#FCD34D",
  },
];

const BENEFITS = [
  "Access to the private Researchvy researcher community",
  "Peer accountability groups and visibility challenges",
  "Early access to free resources and clinic announcements",
  "Monthly network calls with expert speakers",
  "Discounts on Academy programmes and Intelligence audits",
  "Opportunities to contribute to Researchvy Insights",
];

export default function NetworkPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Network
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            You Don&apos;t Have to<br />
            <span style={{ color: "#34D399" }}>Figure This Out Alone.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            The researchers gaining ground fastest are the ones connected to others doing the
            same work, sharing what&apos;s working, holding each other accountable, and learning
            from strategies already proven to move the needle on visibility and impact.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy Network membership")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Join the Network
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

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {PILLARS.map(({ icon: Icon, title, desc, color }) => (
            <HoverCard key={title} accentColor={color} className="p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <h2 className="text-base font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
            </HoverCard>
          ))}
        </div>

        {/* Benefits + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Member Benefits
            </p>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What members receive
            </h2>
            <div className="space-y-3">
              {BENEFITS.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#34D399" }} />
                  <p className="text-sm" style={{ color: "#D1D5DB" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fellows CTA */}
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#34D399" }}>
              Opening Soon
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Join the Waitlist
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              The Network is being built deliberately: small, serious, and focused.
              Express your interest now to be among the first researchers invited when
              membership opens. Spots will be limited.
            </p>
            <div className="space-y-3">
              <a
                href={buildWhatsAppUrl("Researchvy Network waitlist")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1DAE54]"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Express Interest via WhatsApp
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

        {/* Bridge to Academy */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "rgba(52,211,153,0.05)", borderColor: "rgba(52,211,153,0.2)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
              Build your skills before joining the community
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Academy programmes give you the foundation to get the most from the Network and contribute meaningfully.
            </p>
          </div>
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors hover:bg-[#059669]"
            style={{ backgroundColor: "#34D399", color: "#0F172A" }}
          >
            Explore Academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
