import { generatePageMetadata } from "@/lib/seo/metadata";
import { BarChart2, CheckCircle, AlertCircle, ExternalLink, Eye, MousePointer, BookOpen, Mail } from "lucide-react";

export const metadata = generatePageMetadata({ title: "Analytics" });

const isConnected = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

const TRACKED_EVENTS = [
  { icon: Eye,          label: "$pageview",             desc: "Every page visited: path, referrer, device" },
  { icon: MousePointer, label: "$autocapture",           desc: "Clicks, form interactions, rage clicks" },
  { icon: BookOpen,     label: "insight_read",           desc: "When a reader opens an article (auto via pageview)" },
  { icon: BarChart2,    label: "$pageleave",             desc: "When a visitor leaves, dwell time" },
  { icon: Mail,         label: "newsletter_subscribed",  desc: "Successful newsletter form submission" },
];

const SETUP_STEPS = [
  { step: 1, text: "Create a free account at posthog.com" },
  { step: 2, text: "Create a new project, choose US or EU cloud" },
  { step: 3, text: "Copy your Project API Key from Project Settings" },
  { step: 4, text: "Add NEXT_PUBLIC_POSTHOG_KEY=phc_xxx to .env.local" },
  { step: 5, text: "Add NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST to Vercel environment variables" },
  { step: 6, text: "Redeploy, tracking activates on the next visit" },
];

export default function AnalyticsPage() {
  const posthogDashboardUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST
    ? `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/project/default/dashboard`
    : "https://app.posthog.com";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Analytics
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Analytics
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          Visitor tracking and engagement metrics via PostHog.
        </p>
      </div>

      {/* Status banner */}
      <div
        className="flex items-start gap-4 rounded-2xl border p-5 mb-8"
        style={{
          backgroundColor: isConnected ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)",
          borderColor:     isConnected ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)",
        }}
      >
        {isConnected ? (
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#10B981" }} />
        ) : (
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#F59E0B" }} />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
            {isConnected ? "PostHog connected" : "PostHog not configured"}
          </p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            {isConnected
              ? "Analytics tracking is active on all public pages. Pageviews, clicks, and form submissions are being captured."
              : "Add NEXT_PUBLIC_POSTHOG_KEY to your environment variables to activate tracking."}
          </p>
        </div>
        {isConnected && (
          <a
            href={posthogDashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#10B981] hover:text-[#0A0F1A]"
            style={{ color: "#10B981", borderColor: "rgba(16,185,129,0.3)", backgroundColor: "rgba(16,185,129,0.1)" }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open PostHog
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tracked events */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#F9FAFB" }}>
            What&apos;s Being Tracked
          </h2>
          <div className="space-y-3">
            {TRACKED_EVENTS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold" style={{ color: "#F9FAFB" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup guide or next steps */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          {isConnected ? (
            <>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#F9FAFB" }}>
                Recommended PostHog Dashboards
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Web Analytics",          desc: "Pageviews, sessions, bounce rate, top pages" },
                  { label: "User Paths",              desc: "How visitors navigate your site" },
                  { label: "Funnels",                 desc: "Insights → Clinics → WhatsApp conversion" },
                  { label: "Retention",               desc: "How often users return to the site" },
                  { label: "Session Replay",          desc: "Watch real visitor sessions (enable in settings)" },
                ].map(({ label, desc }) => (
                  <div
                    key={label}
                    className="flex items-start gap-2 text-xs rounded-lg px-3 py-2.5"
                    style={{ backgroundColor: "#080E1A" }}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#2563EB" }} />
                    <div>
                      <p className="font-medium" style={{ color: "#F9FAFB" }}>{label}</p>
                      <p className="mt-0.5" style={{ color: "#4B5563" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#F9FAFB" }}>
                Setup Guide
              </h2>
              <div className="space-y-3">
                {SETUP_STEPS.map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                      style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}
                    >
                      {step}
                    </span>
                    <p className="text-xs pt-0.5" style={{ color: "#9CA3AF" }}>{text}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://posthog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors hover:bg-[#1D4ED8]"
                style={{ backgroundColor: "#2563EB", color: "#F9FAFB" }}
              >
                Get started with PostHog (free)
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </div>

      </div>

      {/* Env var reference */}
      <div
        className="mt-6 rounded-xl border px-5 py-4"
        style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.15)" }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>Environment variables</p>
        <div className="space-y-1">
          {[
            ["NEXT_PUBLIC_POSTHOG_KEY",  "phc_xxxxxxxxxxxxxxxxxxxx",           "Your PostHog project API key"],
            ["NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com",           "US cloud (default) or https://eu.i.posthog.com for EU"],
          ].map(([key, example, note]) => (
            <div key={key} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <code className="text-xs font-mono" style={{ color: "#60A5FA" }}>{key}</code>
              <code className="text-xs font-mono" style={{ color: "#374151" }}>{example}</code>
              <span className="text-xs" style={{ color: "#4B5563" }}>— {note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
