import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "The Researchvy Ecosystem",
  description:
    "Explore Researchvy's five specialised divisions covering every dimension of scholarly visibility and research intelligence.",
  path: "/ecosystem",
});

export default function EcosystemPage() {
  return (
    <div style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The Ecosystem
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Every Dimension of Visibility.<br />
            <span style={{ color: "#2563EB" }}>One Ecosystem.</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
            Most researchers address one piece of the visibility problem. Researchvy addresses
            all of it — five specialised divisions working together so nothing gets left behind.
          </p>
        </div>
      </section>

      {/* Divisions — alternating layout */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-24">
          {siteConfig.divisions.map((division, i) => (
            <div
              key={division.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Text — swap order for odd items on desktop */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#2563EB" }}
                >
                  Division {i + 1} of {siteConfig.divisions.length}
                </p>
                <h2
                  className="text-4xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                >
                  {division.name}
                </h2>
                <p className="text-sm font-medium mb-4" style={{ color: "#10B981" }}>
                  {division.tagline}
                </p>
                <p className="text-base leading-relaxed mb-8" style={{ color: "#9CA3AF" }}>
                  {division.description}
                </p>
                <Link
                  href={`/${division.slug}`}
                  className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  Explore {division.name}
                </Link>
              </div>

              {/* Visual card */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div
                  className="rounded-2xl p-12 flex items-center justify-center min-h-[240px] border"
                  style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
                >
                  <div className="text-center">
                    <div
                      className="text-8xl font-bold mb-3 opacity-15"
                      style={{ color: "#2563EB", fontFamily: "var(--font-serif)" }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "#4B5563" }}>
                      {division.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Framework reminder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The Framework
          </p>
          <p className="text-lg font-semibold mb-2" style={{ color: "#F9FAFB" }}>
            Research → Visibility → Discoverability → Connection → Communication → Application →{" "}
            <span style={{ color: "#10B981" }}>Impact</span>
          </p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Every Researchvy division serves at least one step in this journey.
          </p>
        </div>
      </section>
    </div>
  );
}
