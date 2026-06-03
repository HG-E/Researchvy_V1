import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#080E1A" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.07] blur-xl md:blur-3xl pointer-events-none"
        style={{ backgroundColor: "#2563EB" }}
      />

      {/* Minimal top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors text-[#4B5563] hover:text-[#9CA3AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <span className="text-xs font-mono tracking-widest" style={{ color: "#1E293B" }}>
          researchvy.com
        </span>
      </header>

      {/* Form area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Bottom bar */}
      <footer className="relative z-10 text-center py-4 text-xs" style={{ color: "#1E293B" }}>
        © {new Date().getFullYear()} Researchvy · All rights reserved
      </footer>
    </div>
  );
}
