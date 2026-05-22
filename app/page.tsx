import { siteConfig } from "@/config/site";

/**
 * Temporary home page placeholder.
 * Phase 1B replaces this with the full 6-section homepage.
 */
export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}
    >
      <p
        className="text-sm font-medium tracking-widest uppercase mb-6"
        style={{ color: "#3B82F6" }}
      >
        {siteConfig.name}
      </p>
      <h1
        className="text-5xl font-bold mb-4 leading-tight"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {siteConfig.tagline}
      </h1>
      <p className="text-lg max-w-xl mb-10" style={{ color: "#9CA3AF" }}>
        {siteConfig.description}
      </p>
      <div
        className="flex flex-wrap gap-3 justify-center text-xs font-medium tracking-wider uppercase"
        style={{ color: "#6B7280" }}
      >
        {siteConfig.framework.map((step, i) => (
          <span key={step}>
            {step}
            {i < siteConfig.framework.length - 1 && (
              <span className="ml-3" style={{ color: "#2563EB" }}>→</span>
            )}
          </span>
        ))}
      </div>
      <p className="mt-16 text-xs" style={{ color: "#4B5563" }}>
        Phase 1A — Foundation complete. Phase 1B builds the full homepage.
      </p>
    </div>
  );
}
