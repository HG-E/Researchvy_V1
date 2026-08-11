import Link from "next/link";
import { Calendar, Clock, Laptop, CheckCircle2, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/config/site";
import { preClinic, PRE_CLINIC_SESSIONS } from "@/constants/preClinic";
import { PreClinicRegisterForm } from "@/components/pre-clinic/PreClinicRegisterForm";
import { PreClinicSectionNav } from "@/components/pre-clinic/PreClinicSectionNav";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

export const metadata = generatePageMetadata({
  title: "Free Pre-Clinic — ORCID Workshop",
  description:
    "A free, live ORCID workshop from Researchvy. Create your researcher identity, set up your profile correctly, and learn how ORCID fits into your wider visibility strategy — no cost, virtual, come with your laptop.",
  path: "/pre-clinic",
});

const DAY_SESSIONS = PRE_CLINIC_SESSIONS.filter(s => s.id !== "both");

export default function PreClinicPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: "Home",       url: siteConfig.url },
          { name: "Pre-Clinic", url: `${siteConfig.url}/pre-clinic` },
        ])) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Hero */}
        <div id="overview" className="max-w-3xl mb-10 scroll-mt-32">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            {preClinic.title} · FREE
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            {preClinic.tagline}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-4" style={{ color: "#1F2937" }}>
            {preClinic.subtitle}
          </p>
          <div
            className="rounded-xl border-l-4 px-5 py-4 max-w-2xl"
            style={{ backgroundColor: "rgba(16,185,129,0.04)", borderLeftColor: "#10B981" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#1F2937" }}>
              <strong style={{ color: "#111827" }}>Don't skip this step.</strong>{" "}
              {preClinic.keyMessage}
            </p>
          </div>
        </div>

        <PreClinicSectionNav />

        {/* Session cards */}
        <div id="sessions" className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 scroll-mt-32">
          {DAY_SESSIONS.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
                {s.label}
              </p>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="h-4 w-4" style={{ color: "#6B7280" }} />
                <span className="text-sm font-semibold" style={{ color: "#111827" }}>{s.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: "#6B7280" }} />
                <span className="text-sm" style={{ color: "#1F2937" }}>{s.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 mb-14 max-w-2xl">
          <Laptop className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#6B7280" }} />
          <p className="text-sm" style={{ color: "#1F2937" }}>
            Attend either session — or both. This is a <strong style={{ color: "#111827" }}>virtual</strong> session:
            come with your laptop so you can create or fix your ORCID iD live. Your join link is sent by email and
            WhatsApp closer to the date. Free — limited seats per session.
          </p>
        </div>

        {/* Agenda */}
        <div id="agenda" className="mb-14 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
            What we'll cover
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {preClinic.agenda.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#10B981" }} />
                <span className="text-sm leading-relaxed" style={{ color: "#1F2937" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Registration form */}
        <div id="register" className="mb-14 scroll-mt-32">
          <div
            className="rounded-2xl border p-6 sm:p-10"
            style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
              Reserve your free spot
            </h2>
            <p className="text-sm mb-8" style={{ color: "#1F2937" }}>
              Takes less than a minute. No payment, no card required.
            </p>
            <PreClinicRegisterForm />
          </div>
        </div>

        {/* What's next — soft pointer to the paid clinic */}
        <div
          className="rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 justify-between"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#60A5FA" }}>
              After the Pre-Clinic
            </p>
            <p className="text-base font-semibold mb-1" style={{ color: "#F9FAFB" }}>
              ORCID is one piece. The full Digital Visibility Clinic covers the rest.
            </p>
            <p className="text-sm" style={{ color: "#9CA3AF" }}>
              5 live sessions, a personal visibility strategy, and a verified certificate.
            </p>
          </div>
          <Link
            href="/clinics"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors shrink-0"
            style={{ backgroundColor: "#2563EB" }}
          >
            Explore the Clinic
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <WhatsAppButton context="Free ORCID Pre-Clinic" label="Prefer WhatsApp? DM to join" variant="outline" />
        </div>
      </div>
    </div>
  );
}
