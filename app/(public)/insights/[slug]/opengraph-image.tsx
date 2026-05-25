import { ImageResponse } from "next/og";
import { getInsightBySlug } from "@/lib/cms/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABELS: Record<string, string> = {
  "scholarly-visibility":      "Scholarly Visibility",
  "research-intelligence":     "Research Intelligence",
  "scholarly-communication":   "Scholarly Communication",
  "modern-scholarly-systems":  "Modern Scholarly Systems",
  "institutional-positioning": "Institutional Positioning",
};

const CATEGORY_COLORS: Record<string, string> = {
  "scholarly-visibility":      "#60A5FA",
  "research-intelligence":     "#A78BFA",
  "scholarly-communication":   "#34D399",
  "modern-scholarly-systems":  "#FCD34D",
  "institutional-positioning": "#F472B6",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  const title        = insight?.title       ?? "Research Visibility Insights";
  const category     = insight?.category    ?? "scholarly-visibility";
  const author       = insight?.author?.name ?? "Researchvy Editorial";
  const readingTime  = insight?.reading_time ?? 5;
  const accentColor  = CATEGORY_COLORS[category]  ?? "#60A5FA";
  const categoryLabel = CATEGORY_LABELS[category] ?? "Scholarly Visibility";
  const initial      = author[0].toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "60px 64px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px", height: "40px",
            backgroundColor: "#0F172A",
            border: "1px solid #334155",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "18px", fontWeight: "700", fontFamily: "Georgia, serif" }}>R</span>
          </div>
          <span style={{ color: "#F9FAFB", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>
            Researchvy
          </span>
        </div>
        <div style={{
          backgroundColor: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
          borderRadius: "24px",
          padding: "7px 18px",
          color: accentColor,
          fontSize: "11px",
          fontWeight: "700",
          fontFamily: "Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          {categoryLabel}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          width: "56px", height: "5px",
          backgroundColor: accentColor,
          borderRadius: "3px",
          marginBottom: "36px",
        }} />
        <h1 style={{
          margin: "0",
          fontSize: title.length > 70 ? "40px" : title.length > 50 ? "48px" : "56px",
          fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.18",
          letterSpacing: "-0.025em",
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: "960px",
        }}>
          {title}
        </h1>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "32px",
        borderTop: "1px solid #1E293B",
        marginTop: "40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "40px", height: "40px",
            backgroundColor: "#1E293B",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#60A5FA",
            fontSize: "15px",
            fontWeight: "700",
            fontFamily: "Arial, sans-serif",
          }}>
            {initial}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ color: "#F9FAFB", fontSize: "14px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>{author}</span>
            <span style={{ color: "#6B7280", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>Researchvy Insights</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ color: "#4B5563", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>{readingTime} min read</span>
          <span style={{ color: "#1E293B", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>researchvy.com</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
