import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { EventSubmitForm } from "@/components/events/EventSubmitForm";

export const metadata = generatePageMetadata({
  title: "Submit an Academic Event",
  description: "Submit your conference, seminar, workshop, or academic event to the Researchvy Events Board. Free to list.",
  path: "/events/submit",
  noIndex: true,
});

export default async function SubmitEventPage() {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/events/submit");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <div className="mb-8">
          <Link href="/events" className="flex items-center gap-1.5 text-xs font-semibold mb-6"
            style={{ color: "#4B5563" }}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Events
          </Link>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Events
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Submit Your Academic Event
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            Promote your conference, seminar, workshop, webinar, or other academic event to thousands of researchers.
            Free to list. Reviewed within 2 business days.
          </p>

          {/* What's accepted */}
          <div className="rounded-xl border p-5 mb-8" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              We accept submissions for
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "International / national conferences",
                "Department seminars & colloquia",
                "Workshops & skills training",
                "Symposia & summer schools",
                "Webinars & online lectures",
                "Research hackathons",
                "Panel discussions & roundtables",
                "Grant writing & career events",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                  <CheckCircle className="h-3 w-3 flex-shrink-0" style={{ color: "#10B981" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The multi-step form */}
        <EventSubmitForm />

      </div>
    </div>
  );
}
