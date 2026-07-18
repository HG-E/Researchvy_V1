import { generatePageMetadata } from "@/lib/seo/metadata";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactSidebar } from "@/components/forms/ContactSidebar";

export const metadata = generatePageMetadata({
  title: "Contact Researchvy",
  description:
    "Get in touch with the Researchvy team. We respond within 1–2 business days, or reach us instantly via WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#111827" }}>
      {/* Hero */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="mx-auto max-w-3xl">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#2563EB" }}
          >
            Get in Touch
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            Questions, partnerships, or just curious about what we do, we&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form — wider column */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#111827" }}>
              Send a Message
            </h2>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <ContactSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
