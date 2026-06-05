"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2, BadgeCheck } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/common/Logo";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { signUpSchema, type SignUpInput } from "@/lib/validation/schemas";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

const INPUT_BASE =
  "w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#4B5563]";

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    password.length >= 12,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const bar = [
    { label: "", color: "#EF4444" },
    { label: "Weak", color: "#EF4444" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#3B82F6" },
    { label: "Strong", color: "#10B981" },
    { label: "Very Strong", color: "#10B981" },
  ][score];

  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-400"
            style={{ backgroundColor: i <= score ? bar.color : "#1E293B" }}
          />
        ))}
      </div>
      {bar.label && (
        <p className="text-xs font-medium" style={{ color: bar.color }}>
          {bar.label} password
        </p>
      )}
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);

  const raw      = searchParams.get("next") ?? "";
  const nextPath = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  // Set by the ORCID callback route via server-side cookie — URL param is
  // only a visual hint; the actual ORCID iD is read from the HttpOnly cookie server-side.
  const orcidPrefill = searchParams.get("orcid_prefill") === "1";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  async function onSubmit(data: SignUpInput) {
    setAuthError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          institutional_affiliation: data.institutional_affiliation ?? "",
          redirectTo: `${window.location.origin}${nextPath}`,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setAuthError(json.error ?? "Account creation failed. Please try again.");
        return;
      }

      track(EVENTS.SIGN_UP_COMPLETED);
      setSuccess(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setAuthError(`Connection failed: ${msg}. Please try again or contact support@researchvy.com`);
    }
  }

  if (success) {
    return (
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="flex justify-center mb-6">
            <Logo variant="full" width={120} linkToHome />
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
          >
            <CheckCircle2 className="h-8 w-8" style={{ color: "#10B981" }} />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Check your email
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#9CA3AF" }}>
            We sent a verification link to your email. Click it to activate your account and
            access your Researchvy dashboard.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: "#2563EB" }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ maxWidth: "440px" }}>
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="full" width={120} linkToHome />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Create your account
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Join the scholarly visibility ecosystem
          </p>
        </div>

        <SocialAuthButtons next={nextPath} mode="signup" />

        {/* ORCID pre-fill banner — shown when redirected from ORCID OAuth signup flow */}
        {orcidPrefill && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3 mb-5"
            style={{ backgroundColor: "rgba(166,206,57,0.06)", borderColor: "rgba(166,206,57,0.25)" }}>
            <BadgeCheck className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#A6CE39" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
              Your <span className="font-semibold" style={{ color: "#A6CE39" }}>ORCID iD</span> has
              been verified — it will be linked to your account automatically once you complete registration.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full name */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              Full Name
            </label>
            <input
              {...register("full_name")}
              type="text"
              autoComplete="name"
              className={INPUT_BASE}
              style={{
                backgroundColor: "#1E293B",
                borderColor: errors.full_name ? "#EF4444" : "#334155",
                color: "#F9FAFB",
              }}
              placeholder="Dr. Jane Researcher"
            />
            {errors.full_name && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              Email Address
            </label>
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
            {errors.email && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Institution (optional) */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              Institution{" "}
              <span className="normal-case font-normal" style={{ color: "#6B7280" }}>
                (optional)
              </span>
            </label>
            <input
              {...register("institutional_affiliation")}
              type="text"
              className={INPUT_BASE}
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#F9FAFB",
              }}
              placeholder="University of Lagos"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={INPUT_BASE}
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: errors.password ? "#EF4444" : "#334155",
                  color: "#F9FAFB",
                  paddingRight: "44px",
                }}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
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
            <PasswordStrengthBar password={passwordValue} />
            {errors.password && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("confirm_password")}
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className={INPUT_BASE}
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: errors.confirm_password ? "#EF4444" : "#334155",
                  color: "#F9FAFB",
                  paddingRight: "44px",
                }}
                placeholder="Repeat your password"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                style={{ color: "#6B7280" }}
                onClick={() => setShowConfirm(!showConfirm)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.confirm_password.message}
              </p>
            )}
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
                Creating account…
              </>
            ) : (
              "Create your account"
            )}
          </button>

          <p className="text-center text-xs leading-relaxed" style={{ color: "#6B7280" }}>
            By creating an account you agree to our{" "}
            <Link href="/terms" style={{ color: "#6B7280" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "#6B7280" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        {/* Sign in link */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "#1E293B" }} />
          <p className="text-sm text-center" style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold transition-colors"
              style={{ color: "#F9FAFB" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#F9FAFB")}
            >
              Sign in
            </Link>
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "#1E293B" }} />
        </div>
      </div>
    </div>
  );
}
