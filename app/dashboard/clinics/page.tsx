import Link from "next/link";
import { GraduationCap, ArrowRight, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({ title: "My Clinics", noIndex: true });

const UPCOMING_CLINICS = [
  {
    name: "Digital Visibility Clinic™",
    tagline: "A scholarly visibility and discoverability transformation experience",
    status: "Scheduling soon",
    href: "/clinics",
  },
];

export default function MyClinicsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "#2563EB" }}
        >
          Dashboard
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          My Clinics
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your registered clinics and participation history
        </p>
      </div>

      {/* Empty state — registered */}
      <div
        className="rounded-2xl border p-10 flex flex-col items-center text-center"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
        >
          <GraduationCap className="h-8 w-8" style={{ color: "#2563EB" }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
          No clinics yet
        </h2>
        <p className="text-sm max-w-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
          You haven&apos;t registered for any clinics. Join a Researchvy clinic to begin your
          scholarly visibility transformation.
        </p>
        <Link
          href="/clinics"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200"
        >
          Browse Clinics <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Upcoming clinics teaser */}
      <div>
        <h2
          className="text-sm font-semibold mb-4 flex items-center gap-2"
          style={{ color: "#9CA3AF" }}
        >
          <Clock className="h-4 w-4" />
          Upcoming Clinics
        </h2>
        <div className="space-y-3">
          {UPCOMING_CLINICS.map((clinic) => (
            <Link
              key={clinic.name}
              href={clinic.href}
              className="group flex items-center justify-between rounded-2xl border p-5 transition-all duration-200 hover:border-[#2563EB]"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                  {clinic.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {clinic.tagline}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                >
                  {clinic.status}
                </span>
                <ArrowRight
                  className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                  style={{ color: "#4B5563" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
