"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { digitalVisibilityClinic } from "@/constants/clinics";

type Testimonial = (typeof digitalVisibilityClinic.testimonials)[number];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="rounded-2xl border p-6 flex flex-col h-full"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      <Quote className="h-5 w-5 mb-4 flex-shrink-0" style={{ color: "#1E3A5F" }} />
      <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#374151" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="border-t pt-4" style={{ borderColor: "#E2E8F0" }}>
        <p className="text-sm font-semibold" style={{ color: "#111827" }}>
          {t.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          {t.institution}
        </p>
        <span
          className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "rgba(16,185,129,0.1)",
            color: "#10B981",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          {t.cohort}
        </span>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  const { testimonials } = digitalVisibilityClinic;
  const [paused, setPaused] = useState(false);

  // 7 cards, 3 visible at a time.
  // Cards use no CSS gap — only inner px-2 (8px each side = 16px between adjacent cards).
  // Track width = 7 × cardWidth exactly, so translateX(-4/7 × 100%) = -57.14% moves
  // precisely 4 card widths, revealing cards 5–7.
  // Keyframe-level timing-function overrides let us apply ease-in-out to each slide
  // while holding clean pauses at both ends (purely with linear overall timing).

  return (
    <>
      <style>{`
        @keyframes testimonials-slide {
          0%   { transform: translateX(0);        animation-timing-function: ease-in-out; }
          12%  { transform: translateX(0);        animation-timing-function: ease-in-out; }
          50%  { transform: translateX(-57.14%);  animation-timing-function: linear;      }
          62%  { transform: translateX(-57.14%);  animation-timing-function: ease-in-out; }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Desktop (sm+): auto-sliding ping-pong carousel */}
      <div
        className="hidden sm:block overflow-hidden"
        style={{ containerType: "inline-size" } as React.CSSProperties}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex"
          style={{
            animation: "testimonials-slide 20s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                flexShrink: 0,
                width: "calc(33.3333cqw)",
                padding: "0 8px",
              } as React.CSSProperties}
            >
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (< sm): auto-playing swipe carousel */}
      <MobileCarousel
        className="sm:hidden"
        autoPlay
        autoPlayDelay={5000}
        dotColor="#10B981"
        items={testimonials.map((t) => (
          <div key={t.name} className="px-0.5">
            <TestimonialCard t={t} />
          </div>
        ))}
      />
    </>
  );
}
