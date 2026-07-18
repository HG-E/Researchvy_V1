"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isOpen ? "#F1F5F9" : "#FFFFFF",
        borderColor: isOpen ? "rgba(37,99,235,0.35)" : "#1E293B",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        {/* Numbered badge */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-200"
          style={{
            backgroundColor: isOpen ? "rgba(37,99,235,0.2)" : "#1E293B",
            color: isOpen ? "#60A5FA" : "#4B5563",
            border: isOpen ? "1px solid rgba(37,99,235,0.4)" : "1px solid #283548",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="flex-1 text-sm font-semibold leading-snug"
          style={{ color: isOpen ? "#F9FAFB" : "#D1D5DB" }}
        >
          {item.question}
        </span>

        {/* Plus icon rotates 45° when open */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            backgroundColor: isOpen ? "rgba(37,99,235,0.15)" : "#1E293B",
            color: isOpen ? "#60A5FA" : "#4B5563",
          }}
          aria-hidden="true"
        >
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Animated body */}
      <div
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div ref={bodyRef} className="px-5 pb-5 pl-[3.75rem]">
          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClinicFAQ({ items }: { items: ReadonlyArray<FAQItem> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          item={item}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
