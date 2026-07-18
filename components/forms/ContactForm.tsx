"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const INPUT_STYLE = {
  backgroundColor: "#F1F5F9",
  borderColor: "#CBD5E1",
  color: "#111827",
};

const ERROR_STYLE = { borderColor: "#EF4444" };

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormData) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        reset();
      } else {
        setServerError("Something went wrong. Please try again or contact us directly.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-10 border text-center"
        style={{ backgroundColor: "#F1F5F9", borderColor: "#CBD5E1" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#10B981" }}
        >
          <CheckCircle className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "#111827" }}>
          Message Received
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          Thank you for reaching out. We respond within 1–2 business days. For urgent
          enquiries, please use the WhatsApp button below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            Full Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.name ? ERROR_STYLE : {}) }}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.email ? ERROR_STYLE : {}) }}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
          Subject
        </label>
        <input
          {...register("subject")}
          className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
          style={{ ...INPUT_STYLE, ...(errors.subject ? ERROR_STYLE : {}) }}
          placeholder="What is this about?"
        />
        {errors.subject && (
          <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
          Message
        </label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors resize-none"
          style={{ ...INPUT_STYLE, ...(errors.message ? ERROR_STYLE : {}) }}
          placeholder="Tell us how we can help..."
        />
        {errors.message && (
          <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
            {errors.message.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm" style={{ color: "#EF4444" }}>
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#2563EB" }}
        onMouseEnter={(e) => {
          if (!isSubmitting) e.currentTarget.style.backgroundColor = "#1D4ED8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2563EB";
        }}
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
