"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/config/site";
import { cn } from "@/lib/utils/helpers";

interface WhatsAppButtonProps {
  /** Programme or clinic name — generates a contextual message */
  context?: string;
  /** Button label — defaults to "Enquire via WhatsApp" */
  label?: string;
  /** Visual style */
  variant?: "primary" | "outline" | "ghost";
  /** Full-width block button */
  fullWidth?: boolean;
  className?: string;
}

const VARIANTS = {
  primary:
    "bg-[#25D366] hover:bg-[#1ebe5a] text-white shadow-sm hover:shadow-md",
  outline:
    "border-2 border-[#25D366] text-[#128C7E] hover:bg-[#f0fdf4] bg-transparent",
  ghost:
    "text-[#128C7E] hover:bg-[#f0fdf4] bg-transparent underline-offset-4 hover:underline",
};

/**
 * WhatsApp enquiry button — used for all clinic pricing requests.
 * Opens WhatsApp web/app with a pre-filled contextual message.
 *
 * Phone: +234 7030515183
 */
export function WhatsAppButton({
  context,
  label = "Enquire via WhatsApp",
  variant = "primary",
  fullWidth = false,
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(context);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens WhatsApp)`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3",
        "text-sm font-semibold transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]",
        VARIANTS[variant],
        fullWidth && "w-full",
        className
      )}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </a>
  );
}
