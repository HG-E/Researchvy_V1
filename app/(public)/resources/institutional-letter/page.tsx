import { generatePageMetadata } from "@/lib/seo/metadata";
import { PrintButton } from "@/components/resources/PrintButton";

export const metadata = generatePageMetadata({
  title: "Institutional Support Letter — Digital Visibility Clinic",
  description: "A formal professional development letter for researchers seeking departmental or institutional funding for the Digital Visibility Clinic, July 2026 cohort.",
  path: "/resources/institutional-letter",
});

export default function InstitutionalLetterPage() {
  return (
    <div className="min-h-screen py-14 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-4xl">

        {/* Page header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              For Institutional Applicants
            </p>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Professional Development Support Letter
            </h1>
            <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
              Present this letter to your head of department, faculty office, or finance officer
              to request institutional funding for your place in the July 2026 cohort.
            </p>
          </div>
          <PrintButton />
        </div>

        {/* Letter card */}
        <div
          className="rounded-3xl border overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          id="letter"
        >
          {/* Gradient top bar */}
          <div className="h-1.5" style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }} />

          <div className="p-10 sm:p-14 print:p-8">

            {/* Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12 pb-8 border-b" style={{ borderColor: "#1E293B" }}>
              <div>
                <p className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB", fontFamily: "var(--font-serif)" }}>
                  Researchvy
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Research Beyond Publication
                </p>
                <div className="mt-3 space-y-0.5 text-xs" style={{ color: "#4B5563" }}>
                  <p>Lagos, Nigeria · New York, USA</p>
                  <p>info@researchvy.com · researchvy@gmail.com</p>
                  <p>+234 703 051 5183</p>
                  <p>researchvy.com</p>
                </div>
              </div>
              <div className="text-xs text-right" style={{ color: "#6B7280" }}>
                <p>Ref: DVC-JUL2026-PD</p>
                <p className="mt-1">May 2026</p>
              </div>
            </div>

            {/* Addressee block */}
            <div className="mb-8 text-sm" style={{ color: "#9CA3AF" }}>
              <p className="font-semibold" style={{ color: "#F9FAFB" }}>To:</p>
              <p>The Head of Department / Faculty / Finance Officer</p>
              <p>[Researcher&apos;s Institution Name]</p>
              <p>[Department / Faculty]</p>
            </div>

            {/* Subject */}
            <p className="text-sm font-bold mb-8 pb-4 border-b" style={{ color: "#F9FAFB", borderColor: "#1E293B" }}>
              Re: Professional Development Funding Request — Digital Visibility Clinic, July 2026 Cohort
            </p>

            {/* Body */}
            <div className="space-y-5 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              <p>Dear Head of Department / Finance Officer,</p>

              <p>
                We write to confirm that <strong style={{ color: "#F9FAFB" }}>[Researcher&apos;s Full Name]</strong>,
                of <strong style={{ color: "#F9FAFB" }}>[Department / Faculty, Institution]</strong>, has applied
                for enrolment in the <strong style={{ color: "#F9FAFB" }}>Digital Visibility Clinic — July 2026 Cohort</strong>,
                facilitated by Researchvy. This letter is provided to support a formal request for
                institutional professional development funding.
              </p>

              <div
                className="rounded-xl p-5 border"
                style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.15)" }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
                  Programme Overview
                </p>
                <div className="space-y-2 text-xs" style={{ color: "#9CA3AF" }}>
                  <p><strong style={{ color: "#D1D5DB" }}>Programme name:</strong> Digital Visibility Clinic™</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Facilitating organisation:</strong> Researchvy</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Cohort dates:</strong> July 1 – 28, 2026</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Format:</strong> 4 live online sessions (2 hours each) + async platform-based activities</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Delivery:</strong> Wednesday or Sunday, 5:00–7:00 PM EST / 10:00 PM–12:00 AM WAT</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Cohort size:</strong> Maximum 20 participants (small cohort, high-touch)</p>
                  <p><strong style={{ color: "#D1D5DB" }}>Certificate awarded:</strong> Certificate of Scholarly Visibility Practice (verifiable, shareable on LinkedIn)</p>
                </div>
              </div>

              <p>
                The Digital Visibility Clinic is a structured, evidence-based professional development
                programme designed specifically for researchers at all career stages. It addresses a
                critical and widely documented gap in academic training: most researchers receive no
                formal instruction in how to make their published work discoverable, citable, or
                impactful beyond their immediate institution.
              </p>

              <p>
                Over four intensive live sessions, participants will:
              </p>

              <ul className="space-y-1.5 pl-4">
                {[
                  "Establish and fully optimise their scholarly digital identity across Google Scholar, ORCID, and Scopus",
                  "Understand and improve their citation metrics, h-index trajectory, and bibliometric profile",
                  "Develop skills in research communication for diverse audiences — including policymakers, practitioners, and the public",
                  "Build a personalised 12-month scholarly visibility strategy aligned with their career stage and discipline",
                  "Receive a verified Certificate of Scholarly Visibility Practice upon successful completion",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#2563EB" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <p>
                These competencies directly support the researcher&apos;s institutional impact metrics,
                grant eligibility, promotion criteria, and international research standing — benefiting
                both the individual and the institution&apos;s research reputation profile.
              </p>

              <div
                className="rounded-xl p-5 border"
                style={{ backgroundColor: "rgba(16,185,129,0.03)", borderColor: "rgba(16,185,129,0.15)" }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
                  Investment
                </p>
                <div className="space-y-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                  <p>
                    <strong style={{ color: "#D1D5DB" }}>Visibility Starter:</strong>{" "}
                    $59 USD / ₦38,000 NGN (early bird, before June 20, 2026) · $79 / ₦50,000 regular
                  </p>
                  <p>
                    <strong style={{ color: "#D1D5DB" }}>Visibility Builder</strong>{" "}
                    <span style={{ color: "#10B981" }}>(most popular)</span>
                    <strong style={{ color: "#D1D5DB" }}>:</strong>{" "}
                    $99 USD / ₦65,000 NGN (early bird) · $149 / ₦85,000 regular
                  </p>
                  <p>
                    <strong style={{ color: "#D1D5DB" }}>Visibility Pro:</strong>{" "}
                    $179 USD / ₦99,000 NGN (early bird) · $249 / ₦130,000 regular
                  </p>
                  <p className="mt-2 pt-2 border-t" style={{ borderColor: "#1E293B" }}>
                    Group enrolments of 5 or more researchers receive a 20% institutional discount.
                    Groups of 11–20 receive 30% off. Institutional invoices are available upon request.
                  </p>
                </div>
              </div>

              <p>
                We confirm that the programme has been delivered previously in partnership with the
                American Society for Microbiology (ASM), Nigeria Chapter, where researchers across
                disciplines — including early-career and established academics — reported measurable
                improvements in their scholarly visibility, citation profiles, and research communication
                capacity within weeks of completing the programme.
              </p>

              <p>
                We would be pleased to provide any additional information required to support this
                funding request. Institutional invoices, group enrolment agreements, and tailored
                proposals are available upon request.
              </p>

              <p style={{ color: "#6B7280" }}>
                Contact:{" "}
                <span style={{ color: "#9CA3AF" }}>info@researchvy.com · researchvy@gmail.com · +234 703 051 5183</span>
              </p>

              <p>Yours sincerely,</p>
            </div>

            {/* Signature block */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "#1E293B" }}>
              <div
                className="w-36 h-0.5 mb-4"
                style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }}
              />
              <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Ekene Hillary</p>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                Founder & Director, Researchvy
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                Lagos, Nigeria · New York, USA
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>
                info@researchvy.com · +234 703 051 5183
              </p>
            </div>

            {/* Footer note */}
            <div
              className="mt-10 rounded-xl p-4 text-xs"
              style={{ backgroundColor: "#080E1A", color: "#4B5563" }}
            >
              This letter is issued by Researchvy in support of a professional development funding application.
              For verification or additional documentation, contact info@researchvy.com or via WhatsApp at +234 703 051 5183.
              Programme details are accurate as of the date of this letter. Researchvy reserves the right to update programme
              delivery details prior to cohort commencement.
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="mt-6 rounded-xl border p-5 text-xs print:hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#6B7280" }}
        >
          <p className="font-semibold mb-1" style={{ color: "#9CA3AF" }}>How to use this letter</p>
          <p>
            Click <strong style={{ color: "#F9FAFB" }}>Print / Save PDF</strong> above (or press Ctrl+P / Cmd+P) to save as a PDF.
            Fill in your name, department, and institution before printing or sending.
            For a pre-filled version or institutional invoice, contact us via{" "}
            <a
              href="https://wa.me/2347030515183?text=I%20need%20an%20institutional%20letter%20for%20Digital%20Visibility%20Clinic%20July%202026"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563EB" }}
            >
              WhatsApp
            </a>{" "}
            or email info@researchvy.com.
          </p>
        </div>

      </div>
    </div>
  );
}
