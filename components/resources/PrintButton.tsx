"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border flex-shrink-0 print:hidden"
      style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
    >
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </button>
  );
}
