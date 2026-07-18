"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, BadgeCheck, Link2, Link2Off, Check, X, Globe, EyeOff } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileWithPublicSchema, type ProfileWithPublicInput } from "@/lib/validation/schemas";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

const LABEL_STYLE = "block text-xs font-semibold tracking-wide uppercase mb-2";
const INPUT_STYLE =
  "w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200 placeholder:text-[#4B5563]";
const BASE_COLORS = { backgroundColor: "#F1F5F9", borderColor: "#CBD5E1", color: "#111827" };
const ERROR_COLORS = { borderColor: "#EF4444" };

const ORCID_ENABLED = !!process.env.NEXT_PUBLIC_ORCID_ENABLED;

type UsernameState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "taken"; message: string }
  | { status: "invalid"; message: string };

export function ProfileForm({
  initialData,
}: {
  initialData: Partial<ProfileWithPublicInput> & {
    email?: string;
    orcidVerified?: boolean;
    username?: string | null;
    profile_public?: boolean;
  };
}) {
  const router = useRouter();
  const { track } = useAnalytics();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");
  const [disconnecting, setDisconnecting] = useState(false);
  const [usernameState, setUsernameState] = useState<UsernameState>({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOrcidVerified = initialData.orcidVerified ?? false;
  const orcidId         = initialData.orcid ?? "";

  async function handleOrcidDisconnect() {
    setDisconnecting(true);
    await fetch("/api/auth/orcid/disconnect", { method: "POST" });
    router.refresh();
    setDisconnecting(false);
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileWithPublicInput>({
    resolver: zodResolver(profileWithPublicSchema),
    defaultValues: {
      full_name:                 initialData.full_name ?? "",
      bio:                       initialData.bio ?? "",
      orcid:                     initialData.orcid ?? "",
      google_scholar:            initialData.google_scholar ?? "",
      institutional_affiliation: initialData.institutional_affiliation ?? "",
      username:                  initialData.username ?? "",
      profile_public:            initialData.profile_public ?? true,
    },
  });

  const usernameValue   = useWatch({ control, name: "username" });
  const profilePublic   = useWatch({ control, name: "profile_public" });
  const currentUsername = initialData.username ?? "";

  // Debounced live username availability check
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const val = (usernameValue ?? "").trim();

    if (!val || val === currentUsername) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsernameState({ status: "idle" });
      return;
    }

    if (val.length < 3) {
      setUsernameState({ status: "invalid", message: "At least 3 characters" });
      return;
    }

    setUsernameState({ status: "checking" });

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/username/check?q=${encodeURIComponent(val)}`);
        const json = await res.json() as { available: boolean; error?: string };
        if (json.error) {
          setUsernameState({ status: "invalid", message: json.error });
        } else if (json.available) {
          setUsernameState({ status: "available" });
        } else {
          setUsernameState({ status: "taken", message: "Username already taken" });
        }
      } catch {
        setUsernameState({ status: "idle" });
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [usernameValue, currentUsername]);

  async function onSubmit(data: ProfileWithPublicInput) {
    setServerError("");
    setSaved(false);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:                 data.full_name,
          bio:                       data.bio ?? "",
          orcid:                     data.orcid ?? "",
          google_scholar:            data.google_scholar ?? "",
          institutional_affiliation: data.institutional_affiliation ?? "",
          username:                  data.username ?? "",
          profile_public:            data.profile_public ?? true,
        }),
      });

      const json = await res.json() as { error?: string };
      if (!res.ok) {
        setServerError(json.error ?? "Failed to save profile. Please try again.");
        return;
      }

      track(EVENTS.PROFILE_UPDATED, {
        has_orcid:   !!(data.orcid),
        has_scholar: !!(data.google_scholar),
        has_bio:     !!(data.bio),
        has_username: !!(data.username),
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setServerError("Connection error. Please check your internet connection and try again.");
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com";
  const profileUrl = currentUsername ? `${siteUrl}/profile/${currentUsername}` : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Identity */}
      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <h2 className="text-sm font-bold" style={{ color: "#111827" }}>
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
            <span className="normal-case font-normal" style={{ color: "#6B7280" }}>
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
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <div>
          <h2 className="text-sm font-bold" style={{ color: "#111827" }}>
            Scholar Profiles
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Link your academic identifiers to improve discoverability
          </p>
        </div>

        {/* ORCID iD */}
        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            ORCID iD
          </label>

          {isOrcidVerified && orcidId ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}>
              <div className="flex items-center gap-2 min-w-0">
                <BadgeCheck className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
                <a
                  href={`https://orcid.org/${orcidId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono truncate hover:underline"
                  style={{ color: "#34D399" }}
                >
                  {orcidId}
                </a>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                  Verified
                </span>
              </div>
              <button
                type="button"
                onClick={handleOrcidDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-opacity hover:opacity-70"
                style={{ color: "#6B7280" }}
              >
                <Link2Off className="h-3.5 w-3.5" />
                {disconnecting ? "Removing…" : "Disconnect"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {orcidId && !isOrcidVerified && (
                <p className="text-xs rounded-lg border px-3 py-2 font-mono" style={{ color: "#6B7280", borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}>
                  {orcidId} — <span style={{ color: "#F59E0B" }}>unverified</span>
                </p>
              )}
              {ORCID_ENABLED ? (
                <a
                  href="/api/auth/orcid"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 self-start"
                  style={{ backgroundColor: "#A6CE39" }}
                >
                  <Link2 className="h-4 w-4" />
                  Connect ORCID iD
                </a>
              ) : (
                <div className="rounded-xl border px-4 py-3 text-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#6B7280" }}>
                  ORCID verification coming soon — link your iD for trusted research identity.
                </div>
              )}
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Connecting your ORCID iD confirms your researcher identity and improves discoverability.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            Google Scholar URL{" "}
            <span className="normal-case font-normal" style={{ color: "#6B7280" }}>
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

      {/* Public profile */}
      <div
        className="rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <div>
          <h2 className="text-sm font-bold" style={{ color: "#111827" }}>
            Public Profile
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Your shareable researcher URL — visible to anyone on the web
          </p>
        </div>

        {/* Username */}
        <div>
          <label className={LABEL_STYLE} style={{ color: "#6B7280" }}>
            Username
          </label>
          <div className="relative">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-sm"
              style={{ color: "#6B7280" }}
            >
              researchvy.com/profile/
            </div>
            <input
              {...register("username")}
              type="text"
              className={INPUT_STYLE}
              style={{
                ...BASE_COLORS,
                paddingLeft: "calc(1rem + 168px)",
                paddingRight: "2.5rem",
                ...(errors.username || usernameState.status === "taken" || usernameState.status === "invalid"
                  ? ERROR_COLORS
                  : usernameState.status === "available"
                  ? { borderColor: "#10B981" }
                  : {}),
              }}
              placeholder="your-name"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Status indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {usernameState.status === "checking" && (
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#6B7280" }} />
              )}
              {usernameState.status === "available" && (
                <Check className="h-4 w-4" style={{ color: "#10B981" }} />
              )}
              {(usernameState.status === "taken" || usernameState.status === "invalid") && (
                <X className="h-4 w-4" style={{ color: "#EF4444" }} />
              )}
            </div>
          </div>

          {/* Status messages */}
          {usernameState.status === "available" && (
            <p className="text-xs mt-1.5" style={{ color: "#10B981" }}>
              Available
            </p>
          )}
          {(usernameState.status === "taken" || usernameState.status === "invalid") && (
            <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
              {usernameState.message}
            </p>
          )}
          {errors.username && (
            <p className="text-xs mt-1.5" style={{ color: "#F87171" }}>
              {errors.username.message}
            </p>
          )}
          {usernameState.status === "idle" && !errors.username && (
            <p className="text-xs mt-1.5" style={{ color: "#6B7280" }}>
              3–20 characters. Lowercase letters, numbers, hyphens and underscores only.
            </p>
          )}
        </div>

        {/* Profile public toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>
              {profilePublic ? (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" style={{ color: "#10B981" }} />
                  Profile is public
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <EyeOff className="h-4 w-4" style={{ color: "#6B7280" }} />
                  Profile is hidden
                </span>
              )}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              {profilePublic
                ? "Anyone with your profile URL can view your public page"
                : "Your profile URL returns a 404 — only you can see your dashboard"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={profilePublic ?? true}
            onClick={() => setValue("profile_public", !(profilePublic ?? true), { shouldDirty: true })}
            className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor: profilePublic ? "#2563EB" : "#1E293B",
              border: "1px solid",
              borderColor: profilePublic ? "#2563EB" : "#334155",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
              style={{ transform: profilePublic ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>

        {/* View / link to public profile */}
        {profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "#60A5FA" }}
          >
            View public profile →
          </a>
        ) : (
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Set a username above to get your shareable researcher URL.
          </p>
        )}
      </div>

      {/* Account info (read-only) */}
      {initialData.email && (
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <h2 className="text-sm font-bold mb-4" style={{ color: "#111827" }}>
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
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E8F0",
                color: "#6B7280",
                cursor: "default",
              }}
            />
            <p className="text-xs mt-1.5" style={{ color: "#6B7280" }}>
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
