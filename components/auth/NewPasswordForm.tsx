"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/common/Logo";
import { supabase } from "@/lib/db/client";
import { newPasswordSchema, type NewPasswordInput } from "@/lib/validation/schemas";

export function NewPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordInput>({ resolver: zodResolver(newPasswordSchema) });

  async function onSubmit(data: NewPasswordInput) {
    setServerError("");
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  }

  const INPUT_STYLE = {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    color: "#F9FAFB",
  };

  if (success) {
    return (
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
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
            Password updated
          </h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Your password has been changed successfully. Redirecting to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ maxWidth: "400px" }}>
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="flex justify-center mb-8">
          <Logo variant="full" width={120} linkToHome />
        </div>

        <div className="mb-7">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Set new password
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#6B7280" }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#374151]"
                style={{
                  ...INPUT_STYLE,
                  borderColor: errors.password ? "#EF4444" : "#334155",
                  paddingRight: "44px",
                }}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "#4B5563" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.password.message}
              </p>
            )}
          </div>

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
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#374151]"
                style={{
                  ...INPUT_STYLE,
                  borderColor: errors.confirm_password ? "#EF4444" : "#334155",
                  paddingRight: "44px",
                }}
                placeholder="Repeat your new password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "#4B5563" }}
                onClick={() => setShowConfirm(!showConfirm)}
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
                  color: "#FCA5A5",
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
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-sm transition-colors"
            style={{ color: "#4B5563" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
          >
            Cancel and return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
