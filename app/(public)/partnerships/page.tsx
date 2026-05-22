import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({ title: "Partnerships" });

export default function PartnershipsPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6" style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>Phase 1B</p>
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Partnerships</h1>
      <p className="text-base max-w-lg" style={{ color: "#9CA3AF" }}>Institutional and organisational partnerships with Researchvy.</p>
    </section>
  );
}

