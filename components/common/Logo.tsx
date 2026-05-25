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

export function Logo({
  variant = "full",
  width,
  linkToHome = true,
  className = "",
}: LogoProps) {
  const iconSize = variant === "full" ? (width ? Math.round(width * 0.27) : 36) : (width ?? 36);

  const logoElement =
    variant === "full" ? (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <Image
          src="/images/brand/logo-icon.png"
          alt=""
          width={iconSize}
          height={iconSize}
          priority
          style={{ objectFit: "contain", width: iconSize, height: iconSize, borderRadius: "22%" }}
        />
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: width ? Math.round(width * 0.115) : 15,
            color: "#F9FAFB",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          Researchvy
        </span>
      </span>
    ) : (
      <Image
        src="/images/brand/logo-icon.png"
        alt="Researchvy"
        width={width ?? 36}
        height={width ?? 36}
        priority
        style={{ objectFit: "contain", borderRadius: "22%" }}
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
