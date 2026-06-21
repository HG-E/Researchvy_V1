import Link from "next/link";
import { CheckCircle2, MessageCircle, Mail, Clock, ArrowRight, Target, Zap, Shield } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "Book a Free Strategy Call — Researchvy",
  description:
    "Not sure where to start? Book a free 20-minute strategy call with a Researchvy visibility expert. We'll walk through your scorecard results, identify your top 3 gaps, and give you a clear action plan — no sales pitch.",
  path: "/consultation",
});

const CALL_AGENDA = [
  {
    time:   "0–5 min",
    label:  "Your current situation",
    detail: "We review your scorecard results (or answer your questions if you haven't taken it yet). No judgment — just an honest read of where you stand.",
    color:  "#2563EB",
  },
  {
    time:   "5–15 min",
    label:  "Your top 3 priority gaps",
    detail: "We identify the three changes that would make the biggest difference to your h-index, citation count, and discoverability — based on your specific profile.",
    color:  "#7C3AED",
  },
  {
    time:   "15–20 min",
    label:  "Your personalised action plan",
    detail: "You leave with a written action plan: what to do first, what tools to use, and whether the Digital Visibility Clinic is the right next step for you.",
    color:  "#059669",
  },
];

const GOOD_FIT = [
  "You took the Visibility Scorecard and scored below 65",
  "You've published consistently but citations aren't moving",
  "You're applying for promotions, grants, or international positions",
  "You're not sure which platforms or tools actually matter",
  "You want to understand the ROI before investing in the Clinic",
];

const NOT_FOR = [
  "A sales pitch (we only recommend the Clinic when it genuinely fits)",
  "Peer review of your manuscripts or grant proposals",
  "Long-form strategic consultancy (that's our Institutional service)",
];

const waUrl = buildWhatsAppUrl("Free Strategy Call");

const WHAT_YOU_GET = [
  { icon: Target,  label: "Honest score read",    detail: "Exactly where you stand and what it means for your career trajectory" },
  { icon: Zap,     label: "3 priority actions",   detail: "The highest-ROI moves for your specific situation, not generic advice" },
  { icon: Shield,  label: "No pressure",          detail: "We'll tell you if the Clinic isn't right for you — and what is" },
  { icon: Clock,   label: "20 minutes maximum",   detail: "Focused, structured, and respectful of your time" },
];

export default function ConsultationPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Free · 20 minutes · No sales pitch
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Book a Free Researcher Visibility Strategy Call
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#94A3B8" }}>
            You took the scorecard. You saw the gaps. Now let&apos;s talk through exactly what to do about them.
            Book 20 minutes with a Researchvy visibility expert — we&apos;ll read your results, identify your top priorities,
            and give you a clear action plan. Free. No obligation.
          </p>

          {/* Primary CTA block */}
          <div
            className="rounded-2xl border p-6 sm:p-8 mb-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "#9CA3AF" }}>
              Book your call — choose how you&apos;d like to connect:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Free%20Strategy%20Call%20Request&body=Hi%2C%20I%27d%20like%20to%20book%20a%20free%2020-minute%20strategy%20call.%20My%20availability%3A%20`}
                className="flex items-center justify-center gap-2.5 rounded-xl border px-6 py-3.5 text-sm font-bold transition-all hover:border-[#334155]"
                style={{ borderColor: "#1E293B", color: "#F9FAFB" }}
              >
                <Mail className="h-4 w-4" />
                Book via Email
              </a>
            </div>
            <p className="text-xs mt-4" style={{ color: "#4B5563" }}>
              We respond within 4 business hours · Calls available Mon–Fri, 9am–6pm WAT
            </p>
          </div>

          {/* Secondary CTA — not yet taken scorecard */}
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Haven&apos;t taken the scorecard yet?{" "}
            <Link
              href="/resources/visibility-scorecard"
              className="font-semibold transition-colors"
              style={{ color: "#2563EB" }}
              onMouseEnter={undefined}
            >
              Take it free (5 minutes) →
            </Link>
          </p>
        </div>

        {/* What you get */}
        <div className="mb-16">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            What you get from the call
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_YOU_GET.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="rounded-2xl border p-5 flex items-start gap-4"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFB" }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call agenda */}
        <div className="max-w-2xl mb-16">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            How the 20 minutes are structured
          </h2>
          <div className="space-y-4">
            {CALL_AGENDA.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 flex gap-5"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div className="flex-shrink-0 text-center min-w-[64px]">
                  <p className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.time}</p>
                  <div className="w-1 h-full mx-auto rounded-full" style={{ backgroundColor: item.color + "30" }} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color: "#F9FAFB" }}>{item.label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column: good fit + not for */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>
              This call is right for you if…
            </p>
            <ul className="space-y-3">
              {GOOD_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>
              This call is NOT for…
            </p>
            <ul className="space-y-3">
              {NOT_FOR.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-4 h-4 flex-shrink-0 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                    style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#F87171" }}
                  >
                    ✕
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Journey banner */}
        <div
          className="rounded-2xl border p-6 sm:p-8 mb-16"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The path to visibility
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
            {[
              { step: "1", label: "Visibility Scorecard", sub: "Free · 5 minutes", href: "/resources/visibility-scorecard", active: false },
              { step: "2", label: "Strategy Call",         sub: "Free · 20 minutes", href: "/consultation", active: true },
              { step: "3", label: "Digital Visibility Clinic", sub: "Paid · 3 sessions + 2 masterclasses", href: "/clinics/digital-visibility-clinic", active: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-0 flex-1">
                <Link
                  href={item.href}
                  className="flex-1 flex flex-col sm:items-center group"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors"
                    style={{
                      backgroundColor: item.active ? "#2563EB" : "#1E293B",
                      color:           item.active ? "#fff"     : "#9CA3AF",
                    }}
                  >
                    {item.step}
                  </div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: item.active ? "#F9FAFB" : "#9CA3AF" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{item.sub}</p>
                </Link>
                {i < 2 && (
                  <ArrowRight
                    className="h-4 w-4 flex-shrink-0 hidden sm:block mx-4"
                    style={{ color: "#334155" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Ready to talk?
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            Pick a channel below. We respond within 4 business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4" />
              Book via WhatsApp
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Free%20Strategy%20Call%20Request&body=Hi%2C%20I%27d%20like%20to%20book%20a%20free%2020-minute%20strategy%20call.%20My%20availability%3A%20`}
              className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-all hover:border-[#334155]"
              style={{ borderColor: "#1E293B", color: "#F9FAFB" }}
            >
              <Mail className="h-4 w-4" />
              Book via Email
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
