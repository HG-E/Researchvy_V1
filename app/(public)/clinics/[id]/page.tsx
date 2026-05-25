import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Award, Users, Monitor, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { courseSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { SessionAccordion } from "@/components/clinics/SessionAccordion";
import { EnquiryCard } from "@/components/clinics/EnquiryCard";
import { CaseStudy } from "@/components/sections/CaseStudy";

const CLINICS: Record<string, typeof digitalVisibilityClinic> = {
  [digitalVisibilityClinic.slug]: digitalVisibilityClinic,
};

export function generateStaticParams() {
  return Object.keys(CLINICS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = CLINICS[id];
  if (!clinic) return {};
  return generatePageMetadata({
    title:       clinic.name,
    description: clinic.description,
    path:        `/clinics/${id}`,
  });
}

export default async function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = CLINICS[id];
  if (!clinic) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(clinic.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: "Home",    url: siteConfig.url },
          { name: "Clinics", url: `${siteConfig.url}/clinics` },
          { name: clinic.name, url: `${siteConfig.url}/clinics/${id}` },
        ])) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link
          href="/clinics"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors text-[#4B5563] hover:text-[#9CA3AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Clinics
        </Link>

        {/* Hero */}
        <div className="max-w-3xl mb-14">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-5"
            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            Flagship Programme · ≤{clinic.capacity} Researchers Per Cohort
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            {clinic.name}
          </h1>
          <p className="text-lg leading-relaxed mb-3" style={{ color: "#6B7280" }}>
            {clinic.tagline}
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#4B5563" }}>
            Most researchers finish this clinic and say the same thing: they had no idea how
            invisible they were, and how fixable it was. In our sessions, you get a complete
            scholarly identity overhaul, a personal visibility strategy, and a verified certificate.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { Icon: Clock,   text: clinic.duration },
              { Icon: Monitor, text: clinic.format },
              { Icon: Users,   text: `Up to ${clinic.capacity} participants` },
              { Icon: Award,   text: "Certificate included" },
            ].map(({ Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* Enquiry card — mobile only (in flow) */}
            <div className="lg:hidden">
              <EnquiryCard
                clinicName={clinic.name}
                duration={clinic.duration}
                format={clinic.format}
                capacity={clinic.capacity}
              />
            </div>

            {/* Outcomes */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                What You'll Learn
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                Programme Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clinic.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
                  >
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Case study — full width, breaks out of the content column */}
            <div className="-mx-4 sm:-mx-6 lg:mx-0">
              <CaseStudy />
            </div>

            {/* Curriculum */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                Clinic Curriculum
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                6-Session Agenda
              </h2>
              <SessionAccordion sessions={clinic.sessions} />
            </section>

            {/* Certificate */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                On Completion
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                Your Certificate
              </h2>
              <div
                className="rounded-2xl border p-8"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
                  >
                    <Award className="h-7 w-7" style={{ color: "#F59E0B" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#F9FAFB" }}>
                      {clinic.certificate.name}
                    </h3>
                    <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
                      {clinic.certificate.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {clinic.certificate.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Post-clinic benefits */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                After the Clinic
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                Post-Clinic Benefits
              </h2>
              <div className="space-y-3">
                {clinic.postClinicBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl px-5 py-3.5"
                    style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#2563EB" }} />
                    <p className="text-sm" style={{ color: "#D1D5DB" }}>{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                Common Questions
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {clinic.faq.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border overflow-hidden"
                    style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                  >
                    <summary
                      className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-semibold select-none"
                      style={{ color: "#F9FAFB" }}
                    >
                      {item.question}
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-transform group-open:rotate-45"
                        style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* Pricing note */}
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "#F9FAFB" }}>
                About Pricing
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                Researchvy does not display fixed pricing publicly. Pricing is contextual, based on
                your institution, cohort size, and whether you are registering as an individual or
                through an institution. Reach out via{" "}
                <span style={{ color: "#9CA3AF" }}>WhatsApp</span> or email{" "}
                <a
                  href="mailto:info@researchvy.com?subject=Clinic%20Pricing%20Enquiry"
                  className="transition-colors hover:text-[#60A5FA]"
                  style={{ color: "#9CA3AF" }}
                >
                  info@researchvy.com
                </a>{" "}
                and we will respond with a tailored proposal within 24 hours.
              </p>
            </div>

          </div>

          {/* Sticky enquiry sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <EnquiryCard
                clinicName={clinic.name}
                duration={clinic.duration}
                format={clinic.format}
                capacity={clinic.capacity}
              />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
