"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "full" | "icon";
  /** Display width in px — height is computed from aspect ratio */
  width?: number;
  linkToHome?: boolean;
  className?: string;
}

/**
 * Researchvy logo component.
 * - "full"  → horizontal logo (Ry icon + "Researchvy" wordmark)
 * - "icon"  → square Ry icon only (used in mobile nav, favicon fallback)
 *
 * Never crop, stretch, or recolor the source files.
 */
export function Logo({
  variant = "full",
  width,
  linkToHome = true,
  className = "",
}: LogoProps) {
  const logoElement =
    variant === "full" ? (
      <Image
        src="/images/logo-full.png"
        alt="Researchvy"
        width={width ?? 160}
        height={Math.round((width ?? 160) / 3.35)} // natural aspect ratio of the full logo
        priority
        style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: width ?? 160 }}
        className={className}
      />
    ) : (
      <Image
        src="/images/logo-icon.png"
        alt="Researchvy"
        width={width ?? 40}
        height={width ?? 40} // icon is 1:1 square
        priority
        style={{ objectFit: "contain" }}
        className={className}
      />
    );

  if (!linkToHome) return logoElement;

  return (
    <Link href="/" aria-label="Researchvy — Home">
      {logoElement}
    </Link>
  );
}
