import { ImageResponse } from "next/og";
import { getCourseBySlug } from "@/lib/academy/courses";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate  = 3600;

const LEVEL_COLOR: Record<number, string> = {
  1: "#10B981",
  2: "#2563EB",
  3: "#8B5CF6",
  4: "#F59E0B",
  5: "#EF4444",
};

const LEVEL_LABEL: Record<number, string> = {
  1: "Foundations",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
  5: "Mastery",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course   = await getCourseBySlug(slug);

  const title       = course?.title    ?? "Academy Course";
  const subtitle    = course?.subtitle ?? course?.description ?? null;
  const level       = (course?.level   ?? 1) as 1 | 2 | 3 | 4 | 5;
  const accent      = LEVEL_COLOR[level] ?? "#2563EB";
  const levelLabel  = LEVEL_LABEL[level] ?? `Level ${level}`;
  const isFree      = level === 1;

  const totalLessons = course?.modules?.flatMap((m) => m.lessons ?? []).length ?? 0;
  const moduleCount  = course?.modules?.length ?? 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "52px 60px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
      }}
    >
      {/* Bottom accent gradient bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${accent}80, ${accent})`,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "16px", fontWeight: "700" }}>R</span>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Researchvy Academy</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{
            backgroundColor: `${accent}20`, border: `1px solid ${accent}50`,
            borderRadius: "20px", padding: "5px 14px",
            color: accent, fontSize: "11px", fontWeight: "700",
            fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            Level {level} — {levelLabel}
          </div>
          {isFree && (
            <div style={{
              backgroundColor: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "20px", padding: "5px 14px",
              color: "#10B981", fontSize: "11px", fontWeight: "700",
              fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Free
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{
          margin: "0 0 16px 0",
          fontSize: title.length > 55 ? "40px" : title.length > 35 ? "46px" : "52px",
          fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.15",
          letterSpacing: "-0.025em",
          maxWidth: "920px",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: "0 0 32px 0", fontSize: "20px", color: "#9CA3AF",
            lineHeight: "1.5", fontFamily: "Arial, sans-serif", maxWidth: "800px",
          }}>
            {subtitle.slice(0, 140)}
          </p>
        )}

        {/* Stat pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { label: "Modules",  value: String(moduleCount)  },
            { label: "Lessons",  value: String(totalLessons) },
            { label: "Certificate", value: "Included"         },
            ...(isFree ? [{ label: "Cost", value: "Free" }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", flexDirection: "column", gap: "4px",
              backgroundColor: "#0F172A", border: "1px solid #1E293B",
              borderRadius: "12px", padding: "12px 20px",
            }}>
              <span style={{ color: "#4B5563", fontSize: "10px", fontWeight: "700", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {label}
              </span>
              <span style={{ color: value === "Free" ? "#10B981" : "#F9FAFB", fontSize: "18px", fontWeight: "700", fontFamily: "Arial, sans-serif" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "24px", borderTop: "1px solid #1E293B", marginTop: "32px",
      }}>
        <span style={{ color: "#4B5563", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
          Self-paced · Research visibility curriculum
        </span>
        <span style={{ color: "#374151", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>researchvy.com/academy</span>
      </div>
    </div>,
    { ...size },
  );
}
