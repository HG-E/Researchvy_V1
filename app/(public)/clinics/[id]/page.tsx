import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({ title: "Clinic Detail" });

export default function ClinicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
      style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
        Phase 1E
      </p>
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        Clinic Detail
      </h1>
      <p className="text-base max-w-lg" style={{ color: "#9CA3AF" }}>
        Full clinic detail page — including agenda, outcomes, registration, and WhatsApp enquiry — launches in Phase 1E.
      </p>
    </section>
  );
}
