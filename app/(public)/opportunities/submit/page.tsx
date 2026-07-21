import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { OpportunitySubmitForm } from "@/components/opportunities/OpportunitySubmitForm";
import { CheckCircle } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Submit a Research Opportunity",
  description: "Share a grant, fellowship, travel grant, or call for papers with the Researchvy research community.",
  path: "/opportunities/submit",
  noIndex: true,
});

const ACCEPTED = [
  "Research Grants & Funding Calls",
  "Fellowships & Residencies",
  "Travel Grants & Bursaries",
  "Calls for Papers / Abstracts",
  "Calls for Speakers / Panellists",
  "Collaboration & Joint-PI Calls",
  "Research Jobs & Postdocs",
  "Awards, Prizes & Distinctions",
];

export default async function SubmitOpportunityPage() {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/opportunities/submit");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Community Contribution
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
            Submit a Research Opportunity
          </h1>
          <p className="text-base" style={{ color: "#4B5563" }}>
            Help fellow researchers by sharing grants, fellowships, travel bursaries, and more.
            Our team reviews every submission before it goes live — usually within 48 hours.
          </p>
        </div>

        {/* What we accept */}
        <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
            What we accept
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ACCEPTED.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
                <span className="text-sm" style={{ color: "#4B5563" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Also check Events */}
        <div className="rounded-xl border p-4 mb-8 flex items-start gap-3"
          style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.2)" }}>
          <p className="text-sm" style={{ color: "#4B5563" }}>
            Organising or promoting an academic event (conference, workshop, seminar)?{" "}
            <Link href="/events/submit" style={{ color: "#60A5FA" }} className="font-medium hover:underline">
              Submit it to the Events board instead →
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border p-6 sm:p-8" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <OpportunitySubmitForm />
        </div>
      </div>
    </div>
  );
}
