"use client";

import { Download } from "lucide-react";

interface Props {
  lessonTitle: string;
  courseTitle: string;
}

export function DownloadPdfButton({ lessonTitle, courseTitle: _courseTitle }: Props) {
  function print() {
    // Add a body class for print-only CSS, then trigger browser print-to-PDF
    document.body.classList.add("printing-lesson");
    window.print();
    document.body.classList.remove("printing-lesson");
  }

  return (
    <button
      type="button"
      onClick={print}
      title={`Download "${lessonTitle}" as PDF`}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors min-h-[44px] hover:opacity-80 active:opacity-60 print:hidden"
      style={{ color: "#6B7280", backgroundColor: "#0A0F1A", border: "1px solid #1E293B" }}
    >
      <Download className="h-3.5 w-3.5" />
      Save as PDF
    </button>
  );
}
