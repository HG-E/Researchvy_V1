"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/common/Logo";
import { signInSchema, type SignInInput } from "@/lib/validation/schemas";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

const INPUT_BASE =
  "w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#374151]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "#6B7280" }}>
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs mt-1.5"
            style={{ color: "#F87171" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(data: SignInInput) {
    setAuthError("");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setAuthError(json.error ?? "Sign in failed. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      track(EVENTS.SIGN_IN_COMPLETED);
      const raw  = searchParams.get("next") ?? "";
      const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
      router.push(next);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setAuthError(`Connection failed: ${msg}. Please try again or contact support@researchvy.com`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -7, 7, -4, 4, 0] } : {}}
      transition={{ duration: 0.45 }}
      className="w-full"
      style={{ maxWidth: "400px" }}
    >
      {/* Card */}
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="full" width={120} linkToHome />
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Sign in to your Researchvy account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <Field label="Email address" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className={INPUT_BASE}
              style={{
                backgroundColor: "#1E293B",
                borderColor: errors.email ? "#EF4444" : "#334155",
                color: "#F9FAFB",
              }}
              placeholder="you@institution.edu"
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={INPUT_BASE}
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: errors.password ? "#EF4444" : "#334155",
                  color: "#F9FAFB",
                  paddingRight: "44px",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                style={{ color: "#6B7280" }}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          {/* Forgot password */}
          <div className="flex justify-end -mt-2">
            <Link
              href="/reset-password"
              className="text-xs font-medium transition-colors"
              style={{ color: "#2563EB" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3B82F6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
            >
              Forgot password?
            </Link>
          </div>

          {/* Auth error */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#FCA5A5",
                }}
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
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
                Signing in…
              </>
            ) : (
              "Sign in to Researchvy"
            )}
          </button>
        </form>

        {/* Divider + signup link */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#1E293B" }} />
            <span className="text-xs" style={{ color: "#6B7280" }}>
              new here?
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#1E293B" }} />
          </div>
          <p className="text-center text-sm" style={{ color: "#6B7280" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold transition-colors"
              style={{ color: "#F9FAFB" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#F9FAFB")}
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
