"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { PRE_CLINIC_SESSIONS, CAREER_STAGES } from "@/constants/preClinic";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const SESSION_IDS = PRE_CLINIC_SESSIONS.map(s => s.id) as [string, ...string[]];
const STAGE_IDS   = CAREER_STAGES.map(s => s.id) as [string, ...string[]];

const registerSchema = z.object({
  fullName:        z.string().min(2, "Please enter your full name"),
  email:            z.string().email("Please enter a valid email address"),
  phone:            z.string().min(7, "Please enter a valid phone number"),
  session:          z.enum(SESSION_IDS, { message: "Please choose a session" }),
  careerStage:      z.enum(STAGE_IDS, { message: "Please select your career stage" }),
  fieldOfResearch: z.string().min(2, "Please enter your field of research"),
  institution:      z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const INPUT_STYLE = {
  backgroundColor: "#F1F5F9",
  borderColor:     "#CBD5E1",
  color:            "#111827",
};

const ERROR_STYLE = { borderColor: "#EF4444" };

export function PreClinicRegisterForm() {
  const [submitted, setSubmitted]           = useState(false);
  const [alreadyRegistered, setAlreadyReg]  = useState(false);
  const [serverError, setServerError]       = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      const res = await fetch("/api/pre-clinic/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setAlreadyReg(!!body.alreadyRegistered);
        setSubmitted(true);
        reset();
      } else {
        setServerError(body.error ?? "Something went wrong. Please try again.");
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
          {alreadyRegistered ? "You're already registered" : "You're Registered — Free Spot Confirmed"}
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#4B5563" }}>
          {alreadyRegistered
            ? "We already have your registration on file. Check your inbox for the confirmation email — your join link follows closer to the date."
            : "Check your email for confirmation. Since this is virtual, we'll send your session join link by email and WhatsApp closer to the date."}
        </p>
        <WhatsAppButton context="Free ORCID Pre-Clinic" label="Questions? Message us on WhatsApp" variant="primary" />
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
            {...register("fullName")}
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.fullName ? ERROR_STYLE : {}) }}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.fullName.message}</p>
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
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            WhatsApp / Phone Number
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.phone ? ERROR_STYLE : {}) }}
            placeholder="e.g. +234 703 051 5183"
          />
          {errors.phone && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            Which session?
          </label>
          <select
            {...register("session")}
            defaultValue=""
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.session ? ERROR_STYLE : {}) }}
          >
            <option value="" disabled>Select a session</option>
            {PRE_CLINIC_SESSIONS.map(s => (
              <option key={s.id} value={s.id}>{s.label} — {s.date}, {s.time}</option>
            ))}
          </select>
          {errors.session && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.session.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            Career Stage
          </label>
          <select
            {...register("careerStage")}
            defaultValue=""
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.careerStage ? ERROR_STYLE : {}) }}
          >
            <option value="" disabled>Select your career stage</option>
            {CAREER_STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          {errors.careerStage && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.careerStage.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
            Field of Research
          </label>
          <input
            {...register("fieldOfResearch")}
            className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
            style={{ ...INPUT_STYLE, ...(errors.fieldOfResearch ? ERROR_STYLE : {}) }}
            placeholder="e.g. Public Health, Economics"
          />
          {errors.fieldOfResearch && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors.fieldOfResearch.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
          Institution / Affiliation <span style={{ color: "#9CA3AF" }}>(optional)</span>
        </label>
        <input
          {...register("institution")}
          className="w-full rounded-lg px-4 py-3 text-sm border outline-none transition-colors"
          style={INPUT_STYLE}
          placeholder="Your university or organisation"
        />
      </div>

      {serverError && (
        <p className="text-sm" style={{ color: "#EF4444" }}>{serverError}</p>
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
        {isSubmitting ? "Reserving your spot…" : "Reserve Your Free Spot"}
      </button>
      <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
        Free · Virtual · Limited seats per session
      </p>
    </form>
  );
}
