"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/db/client";
import { profileSchema, type ProfileInput } from "@/lib/validation/schemas";

const LABEL_STYLE = "block text-xs font-semibold tracking-wide uppercase mb-2";
const INPUT_STYLE =
  "w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#374151]";
const BASE_COLORS = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };
const ERROR_COLORS = { borderColor: "#EF4444" };

export function ProfileForm({
  initialData,
}: {
  initialData: Partial<ProfileInput> & { email?: string };
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name:                 initialData.full_name ?? "",
      bio:                       initialData.bio ?? "",
      orcid:                     initialData.orcid ?? "",
      google_scholar:            initialData.google_scholar ?? "",
      institutional_affiliation: initialData.institutional_affiliation ?? "",
    },
  });

  async function onSubmit(data: ProfileInput) {
    setServerError("");
    setSaved(false);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name:                 data.full_name,
        bio:                       data.bio ?? "",
        orcid:                     data.orcid ?? "",
        google_scholar:            data.google_scholar ?? "",
        institutional_affiliation: data.institutional_affiliation ?? "",
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Identity */}
      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <h2 className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
          Scholar Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
              Full Name
            </label>
            <input
              {...register("full_name")}
              type="text"
              className={INPUT_STYLE}
              style={{ ...BASE_COLORS, ...(errors.full_name ? ERROR_COLORS : {}) }}
              placeholder="Dr. Jane Researcher"
            />
            {errors.full_name && (
              <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
              Institution
            </label>
            <input
              {...register("institutional_affiliation")}
              type="text"
              className={INPUT_STYLE}
              style={BASE_COLORS}
              placeholder="University of Lagos"
            />
          </div>
        </div>

        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            Bio{" "}
            <span className="normal-case font-normal" style={{ color: "#374151" }}>
              (optional, max 500 characters)
            </span>
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className={INPUT_STYLE}
            style={{ ...BASE_COLORS, resize: "none" }}
            placeholder="Tell the community about your research focus, expertise, and goals…"
          />
          {errors.bio && (
            <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
              {errors.bio.message}
            </p>
          )}
        </div>
      </div>

      {/* Scholar profiles */}
      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div>
          <h2 className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
            Scholar Profiles
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Link your academic identifiers to improve discoverability
          </p>
        </div>

        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            ORCID iD{" "}
            <span className="normal-case font-normal" style={{ color: "#374151" }}>
              (e.g. 0000-0001-2345-6789)
            </span>
          </label>
          <input
            {...register("orcid")}
            type="text"
            className={INPUT_STYLE}
            style={{ ...BASE_COLORS, ...(errors.orcid ? ERROR_COLORS : {}) }}
            placeholder="0000-0000-0000-0000"
          />
          {errors.orcid && (
            <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
              {errors.orcid.message}
            </p>
          )}
        </div>

        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            Google Scholar URL{" "}
            <span className="normal-case font-normal" style={{ color: "#374151" }}>
              (optional)
            </span>
          </label>
          <input
            {...register("google_scholar")}
            type="url"
            className={INPUT_STYLE}
            style={{ ...BASE_COLORS, ...(errors.google_scholar ? ERROR_COLORS : {}) }}
            placeholder="https://scholar.google.com/citations?user=…"
          />
          {errors.google_scholar && (
            <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
              {errors.google_scholar.message}
            </p>
          )}
        </div>
      </div>

      {/* Account info (read-only) */}
      {initialData.email && (
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <h2 className="text-sm font-bold mb-4" style={{ color: "#F9FAFB" }}>
            Account
          </h2>
          <div>
            <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
              Email Address
            </label>
            <input
              type="email"
              value={initialData.email}
              readOnly
              className={INPUT_STYLE}
              style={{
                backgroundColor: "#0A0F1A",
                borderColor: "#1E293B",
                color: "#4B5563",
                cursor: "default",
              }}
            />
            <p className="text-xs mt-1.5" style={{ color: "#374151" }}>
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>
        </div>
      )}

      {/* Feedback + submit */}
      <div className="flex items-center justify-between gap-4">
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2 text-sm"
              style={{ color: "#10B981" }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Profile saved
            </motion.div>
          )}
          {serverError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm"
              style={{ color: "#F87171" }}
            >
              {serverError}
            </motion.p>
          )}
          {!saved && !serverError && <span />}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          style={{ backgroundColor: "#2563EB" }}
          onMouseEnter={(e) => {
            if (!isSubmitting && isDirty) e.currentTarget.style.backgroundColor = "#1D4ED8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
