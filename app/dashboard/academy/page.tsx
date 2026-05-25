import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2, Clock, Star } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { AcademyEnrollButton } from "@/components/dashboard/AcademyEnrollButton";

export const metadata = generatePageMetadata({ title: "Academy", noIndex: true });

const PROGRAMME = {
  slug:    "research-visibility-academy",
  name:    "Research Visibility Academy",
  tagline: "A structured, self-paced programme to build lasting scholarly presence.",
  href:    "/academy",
  modules: [
    "Scholar Identity & Profile Architecture",
    "Discoverability Systems (ORCID, Google Scholar, Scopus)",
    "Citation Intelligence & Bibliometrics",
    "Research Communication for Non-Academic Audiences",
    "Digital Visibility Strategy & Roadmap",
    "Long-Term Impact Measurement",
  ],
};

async function getEnquiryStatus(userId: string): Promise<"pending" | "contacted" | "enrolled" | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("academy_enquiries")
    .select("status")
    .eq("user_id", userId)
    .eq("programme_slug", PROGRAMME.slug)
    .maybeSingle();
  return (data?.status as "pending" | "contacted" | "enrolled") ?? null;
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "Interest Registered — we'll be in touch",
  contacted: "Contacted — check your inbox",
  enrolled:  "Enrolled",
};

export default async function AcademyPage() {
  const user = await getServerUser();
  if (!user) return null;

  const enquiryStatus = await getEnquiryStatus(user.id);
  const hasRegistered  = enquiryStatus !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#8B5CF6" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Academy
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Structured programmes for building long-term scholarly visibility
        </p>
      </div>

      {/* Programme card */}
      <div
        className="rounded-2xl border overflow-hidden relative"
        style={{ backgroundColor: "#0F172A", borderColor: hasRegistered ? "#8B5CF6" : "#1E293B" }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #8B5CF6, #2563EB)" }} />
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(139,92,246,0.1)" }}
            >
              <BookOpen className="h-7 w-7" style={{ color: "#8B5CF6" }} />
            </div>
            {hasRegistered && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {STATUS_LABELS[enquiryStatus!] ?? "Registered"}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{PROGRAMME.name}</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>{PROGRAMME.tagline}</p>

          {/* Module list */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4B5563" }}>
              Programme Modules
            </p>
            <ul className="space-y-2">
              {PROGRAMME.modules.map((module, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ color: "#9CA3AF" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#8B5CF6" }}
                  >
                    {i + 1}
                  </span>
                  {module}
                </li>
              ))}
            </ul>
          </div>

          {hasRegistered ? (
            <div
              className="rounded-xl border p-5 mb-4"
              style={{ backgroundColor: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#C4B5FD" }}>
                Your interest has been registered. Our team will reach out to{" "}
                <strong style={{ color: "#DDD6FE" }}>{user.email}</strong> with programme details,
                cohort dates, and enrolment information. We typically contact registered members within
                5–7 business days.
              </p>
            </div>
          ) : (
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "#4B5563" }}>
              The academy opens in cohorts. Register your interest and we&apos;ll contact you
              directly with programme details, pricing, and the next available start date.
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {!hasRegistered && <AcademyEnrollButton programmeSlug={PROGRAMME.slug} />}
            <Link
              href={PROGRAMME.href}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={{ color: "#A78BFA" }}
            >
              View Programme Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Why the Academy section */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#9CA3AF" }}>
          <Star className="h-4 w-4" style={{ color: "#F59E0B" }} />
          Why researchers choose the Academy
        </h3>
        <ul className="space-y-3">
          {[
            "Self-paced with structured weekly milestones — fits around your research schedule",
            "Built on the Researchvy 7-Step Framework, validated across 100+ researchers",
            "Lifetime access to all materials, templates, and workbooks",
            "Private cohort community with peer accountability",
            "Direct access to expert advisors for your specific visibility challenges",
          ].map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm" style={{ color: "#6B7280" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#8B5CF6" }} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Also see: Clinics teaser */}
      <div
        className="rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Want faster, guided results?</p>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            The Digital Visibility Clinic gives you 6 live sessions with expert guidance — faster than self-paced.
          </p>
        </div>
        <Link
          href="/dashboard/clinics"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors"
          style={{ backgroundColor: "#2563EB" }}
        >
          View Clinics <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Coming soon note */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#9CA3AF" }}>
          <Clock className="h-4 w-4" />
          Upcoming programmes
        </h2>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
            Specialised tracks for institutional researchers, ECR cohorts, and discipline-specific
            visibility strategy are in development. Academy members are notified first.
          </p>
        </div>
      </div>

    </div>
  );
}
