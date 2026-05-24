import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "About Researchvy",
  description:
    "Learn about Researchvy — our mission to transform scholarly visibility, our framework, and our commitment to research impact.",
  path: "/about",
});

const VALUES = [
  {
    title: "Scholarly Integrity",
    description:
      "We uphold the highest standards of academic rigour in everything we produce and teach.",
  },
  {
    title: "Equity in Visibility",
    description:
      "We believe every researcher, regardless of geography or institution, deserves global discoverability.",
  },
  {
    title: "Impact Over Output",
    description:
      "We measure success not by publication counts but by real-world application and societal change.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Our Mission
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Research Beyond Publication
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Mission + Framework */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
                Why We Exist
              </p>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                The Scholarly Visibility Crisis
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                <p>
                  Millions of valuable research outputs are published each year but remain invisible
                  to the audiences that need them most. Scholars toil in isolation, producing work
                  that never reaches its full potential for societal impact.
                </p>
                <p>
                  Researchvy exists to change this. We are a scholarly visibility and research
                  intelligence ecosystem that helps researchers, academics, and institutions navigate
                  the complex landscape of digital discoverability, strategic communication, and
                  meaningful research impact.
                </p>
                <p>
                  We believe every piece of research has the potential to change something — but
                  only if the right people can find it, understand it, and apply it.
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
                What We Do
              </p>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                The Researchvy Framework
              </h2>
              <div className="space-y-3">
                {siteConfig.framework.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-xl p-4 border"
                    style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: i === siteConfig.framework.length - 1 ? "#10B981" : "#2563EB",
                        color: "#fff",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: i === siteConfig.framework.length - 1 ? "#10B981" : "#F9FAFB",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              The Ecosystem
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Five Specialised Divisions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.divisions.map((division) => (
              <div
                key={division.id}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <h3 className="font-bold text-base mb-1" style={{ color: "#F9FAFB" }}>
                  {division.name}
                </h3>
                <p className="text-xs mb-3" style={{ color: "#2563EB" }}>
                  {division.tagline}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {division.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Our Values
          </p>
          <h2
            className="text-4xl font-bold mb-12"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
              >
                <h3 className="font-bold text-base mb-2" style={{ color: "#F9FAFB" }}>
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
