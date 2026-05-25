"use client";

import { Quote } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { digitalVisibilityClinic } from "@/constants/clinics";

type Testimonial = (typeof digitalVisibilityClinic.testimonials)[number];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="rounded-2xl border p-6 flex flex-col h-full"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <Quote className="h-5 w-5 mb-4 flex-shrink-0" style={{ color: "#1E3A5F" }} />
      <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#D1D5DB" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="border-t pt-4" style={{ borderColor: "#1E293B" }}>
        <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
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

  return (
    <>
      {/* Desktop (sm+): static grid — unchanged */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
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
