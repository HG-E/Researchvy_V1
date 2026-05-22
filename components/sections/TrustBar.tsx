"use client";

import { motion } from "framer-motion";

const PILLARS = [
  { number: "7", label: "Framework Steps" },
  { number: "5", label: "Ecosystem Divisions" },
  { number: "5+", label: "Transformation Emotions" },
  { number: "100%", label: "Scholarly Integrity" },
];

export function TrustBar() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
      <div className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl border p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: "var(--font-serif)", color: "#2563EB" }}
              >
                {pillar.number}
              </p>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                {pillar.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
