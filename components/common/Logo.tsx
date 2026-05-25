import Link from "next/link";
import type { CSSProperties } from "react";

interface LogoProps {
  variant?: "full" | "icon";
  width?: number;
  linkToHome?: boolean;
  className?: string;
}

/**
 * Inline CSS logo — zero HTTP requests, renders on first SSR paint.
 * Matches the Ry serif letterform from the original PNG.
 */
function LogoMark({ size, className }: { size: number; className?: string }) {
  const rSize  = Math.round(size * 0.70);
  const ySize  = Math.round(size * 0.43);
  const padL   = Math.max(3, Math.round(size * 0.09));
  const padB   = Math.max(2, Math.round(size * 0.05));
  const overlap = Math.round(size * 0.05);

  const yStyle: CSSProperties = {
    fontSize:              ySize,
    fontWeight:            700,
    lineHeight:            1,
    letterSpacing:         "-0.02em",
    position:              "relative",
    zIndex:                2,
    background:            "linear-gradient(160deg, #93C5FD 0%, #2563EB 100%)",
    WebkitBackgroundClip:  "text",
    WebkitTextFillColor:   "transparent",
    backgroundClip:        "text",
    paddingBottom:         Math.round(size * 0.04),
  };

  return (
    <span
      aria-hidden="true"
      style={{
        display:     "inline-flex",
        alignItems:  "flex-end",
        width:        size,
        height:       size,
        background:  "linear-gradient(150deg, #0F1724 0%, #091320 100%)",
        borderRadius: "22%",
        fontFamily:  "var(--font-serif, Georgia, 'Times New Roman', serif)",
        flexShrink:   0,
        overflow:    "hidden",
        paddingLeft:  padL,
        paddingBottom: padB,
        boxSizing:   "border-box",
      }}
      className={className}
    >
      <span
        style={{
          fontSize:      rSize,
          fontWeight:    700,
          color:         "#EFF6FF",
          lineHeight:    1,
          letterSpacing: "-0.03em",
          position:      "relative",
          zIndex:        1,
          marginRight:   -overlap,
        }}
      >
        R
      </span>
      <span style={yStyle}>y</span>
    </span>
  );
}

export function Logo({
  variant     = "full",
  width,
  linkToHome  = true,
  className   = "",
}: LogoProps) {
  const iconSize = variant === "full"
    ? (width ? Math.round(width * 0.27) : 36)
    : (width ?? 36);
  const textSize = width ? Math.round(width * 0.115) : 15;

  const logoElement =
    variant === "full" ? (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <LogoMark size={iconSize} />
        <span
          style={{
            fontFamily:    "var(--font-serif, Georgia, serif)",
            fontWeight:    600,
            fontSize:      textSize,
            color:         "#F9FAFB",
            letterSpacing: "-0.01em",
            lineHeight:    1,
          }}
        >
          Researchvy
        </span>
      </span>
    ) : (
      <LogoMark size={width ?? 36} className={className} />
    );

  if (!linkToHome) return logoElement;

  return (
    <Link href="/" aria-label="Researchvy — Home">
      {logoElement}
    </Link>
  );
}
