"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type Provider = "google" | "linkedin_oidc" | "orcid";

// Each provider must be explicitly enabled via an env flag so that
// unconfigured providers never render — avoids 503s hitting users.
const ENABLED_PROVIDERS: Provider[] = (
  [
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED   === "true" && "google",
    process.env.NEXT_PUBLIC_LINKEDIN_AUTH_ENABLED === "true" && "linkedin_oidc",
    process.env.NEXT_PUBLIC_ORCID_ENABLED         === "true" && "orcid",
  ] as (Provider | false)[]
).filter((p): p is Provider => !!p);

interface ProviderConfig {
  label:     string;
  icon:      React.ReactNode;
  bg:        string;
  border:    string;
  textColor: string;
  hoverBg:   string;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const OrcidIcon = () => (
  <svg width="18" height="18" viewBox="0 0 256 256" aria-hidden="true">
    <path fill="#A6CE39" d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0z"/>
    <path fill="#fff" d="M86.3 186.2H70.9V79.1h15.4zm-7.7-119.2c-5.1 0-8.9-3.9-8.9-8.9 0-5.1 3.8-8.9 8.9-8.9 5.1 0 8.9 3.8 8.9 8.9 0 5-.8 8.9-8.9 8.9zm133.3 0c-5.1 0-8.9-3.9-8.9-8.9 0-5.1 3.8-8.9 8.9-8.9 5.1 0 8.9 3.8 8.9 8.9 0 5-3.8 8.9-8.9 8.9zm0 0"/>
    <path fill="#fff" d="M143.5 186.2h-15.4v-107h15.4v18.3c5.5-11 15.3-19.4 30.4-19.4 22.7 0 35.5 15.6 35.5 39.4v68.7h-15.4v-66.7c0-15.7-7.4-27.4-24.2-27.4-15.4 0-26.3 12-26.3 28v66.1z"/>
  </svg>
);

const PROVIDER_CONFIG: Record<Provider, ProviderConfig> = {
  google: {
    label:     "Continue with Google",
    icon:      <GoogleIcon />,
    bg:        "#fff",
    border:    "#E2E8F0",
    textColor: "#1F2937",
    hoverBg:   "#F9FAFB",
  },
  linkedin_oidc: {
    label:     "Continue with LinkedIn",
    icon:      <LinkedInIcon />,
    bg:        "#fff",
    border:    "#E2E8F0",
    textColor: "#1F2937",
    hoverBg:   "#F9FAFB",
  },
  orcid: {
    label:     "Continue with ORCID",
    icon:      <OrcidIcon />,
    bg:        "#fff",
    border:    "#E2E8F0",
    textColor: "#1F2937",
    hoverBg:   "#F9FAFB",
  },
};

interface Props {
  next?: string;
  mode?: "signin" | "signup";
}

export function SocialAuthButtons({ next = "/dashboard", mode = "signin" }: Props) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError]     = useState("");

  // No providers configured → render nothing (no orphan divider in parent)
  if (ENABLED_PROVIDERS.length === 0) return null;

  async function handleSocial(provider: Provider) {
    setLoading(provider);
    setError("");

    try {
      if (provider === "orcid") {
        const params = new URLSearchParams({ next });
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = `/api/auth/orcid?${params}`;
        return;
      }

      const supabase   = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (oauthError) throw oauthError;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      setError(msg);
      setLoading(null);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {ENABLED_PROVIDERS.map((p) => {
          const cfg       = PROVIDER_CONFIG[p];
          const isLoading = loading === p;
          return (
            <button
              key={p}
              type="button"
              disabled={!!loading}
              onClick={() => handleSocial(p)}
              className="w-full flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-150 disabled:opacity-60"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.textColor }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = cfg.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = cfg.bg; }}
            >
              {isLoading
                ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#4B5563" }} />
                : cfg.icon}
              {isLoading
                ? (mode === "signin" ? "Signing in…" : "Signing up…")
                : cfg.label}
            </button>
          );
        })}

        {error && (
          <p className="text-xs text-center rounded-lg px-3 py-2 border"
            style={{ color: "#FCA5A5", backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
            {error}
          </p>
        )}
      </div>

      {/* Divider — only rendered when we actually showed buttons */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ backgroundColor: "#F1F5F9" }} />
        <span className="text-xs" style={{ color: "#4B5563" }}>or continue with email</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#F1F5F9" }} />
      </div>
    </>
  );
}
