"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { copy } from "@/constants/copy";

const ROTATE_INTERVAL = 2800;

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const words = copy.hero.rotatingMessages;

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: "#2563EB" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#2563EB" }}
        >
          Scholarly Visibility Ecosystem
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Research Beyond
          <br />
          <span className="relative inline-block min-w-[280px] sm:min-w-[360px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.38 }}
                className="inline-block"
                style={{ color: "#2563EB" }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#9CA3AF" }}
        >
          {copy.hero.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/clinics"
            className="group inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            {copy.hero.cta.primary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold border transition-all duration-200"
            style={{ color: "#F9FAFB", borderColor: "#1E293B" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.color = "#60A5FA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1E293B";
              e.currentTarget.style.color = "#F9FAFB";
            }}
          >
            {copy.hero.cta.secondary}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm"
          style={{ color: "#4B5563" }}
        >
          {["Research Intelligence", "Scholarly Visibility", "Digital Discoverability"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ color: "#4B5563" }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
