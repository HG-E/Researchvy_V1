"use client";

import { motion } from "framer-motion";

const PILLARS = [
  { number: "≤20",  label: "Researchers Per Cohort" },
  { number: "6",    label: "Sessions to Transform" },
  { number: "5",    label: "Divisions. One Ecosystem." },
  { number: "100%", label: "Verified on Completion" },
];

export function TrustBar() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl border p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ backgroundColor: "#F1F5F9", borderColor: "#CBD5E1" }}
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
              <p className="text-sm" style={{ color: "#4B5563" }}>
                {pillar.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
