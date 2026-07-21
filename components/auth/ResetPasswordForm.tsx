"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/common/Logo";
import { supabase } from "@/lib/db/client";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/schemas";

export function ResetPasswordForm() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError("");
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password/new`,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSubmittedEmail(data.email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div className="flex justify-center mb-6">
            <Logo variant="full" width={120} linkToHome />
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
          >
            <Mail className="h-7 w-7" style={{ color: "#2563EB" }} />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Check your inbox
          </h2>
          <p className="text-sm mb-1 leading-relaxed" style={{ color: "#4B5563" }}>
            We sent a password reset link to
          </p>
          <p className="text-sm font-semibold mb-6" style={{ color: "#111827" }}>
            {submittedEmail}
          </p>
          <p className="text-xs mb-6" style={{ color: "#4B5563" }}>
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="underline transition-colors"
              style={{ color: "#4B5563" }}
            >
              try again
            </button>
            .
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#4B5563" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ maxWidth: "400px" }}>
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="full" width={120} linkToHome />
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Reset your password
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
            Enter your account email and we&apos;ll send you a secure reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#4B5563" }}
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#374151]"
              style={{
                backgroundColor: "#F1F5F9",
                borderColor: "#E2E8F0",
                color: "#111827",
              }}
              placeholder="you@institution.edu"
            />
            {errors.email && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#DC2626",
                }}
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = "#1D4ED8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563EB";
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending link…
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: "#4B5563" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
