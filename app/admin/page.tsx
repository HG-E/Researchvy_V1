import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({ title: "Admin Overview" });

export default function AdminOverviewPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6" style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>Phase 1H</p>
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Admin Overview</h1>
      <p className="text-base max-w-lg" style={{ color: "#9CA3AF" }}>Platform overview for administrators.</p>
    </section>
  );
}

