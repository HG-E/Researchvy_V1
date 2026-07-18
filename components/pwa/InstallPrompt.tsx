"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setVisible(false);
    }
  }

  function handleDismiss() {
    sessionStorage.setItem("pwa-install-dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 rounded-2xl border shadow-xl p-4 flex items-start gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      role="dialog"
      aria-label="Install Researchvy app"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(37,99,235,0.15)" }}
      >
        <Download className="h-5 w-5" style={{ color: "#60A5FA" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "#111827" }}>
          Install Researchvy
        </p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6B7280" }}>
          Add to your home screen for quick access, works offline too.
        </p>
        <button
          onClick={handleInstall}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Download className="h-3 w-3" />
          Install
        </button>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-[#F1F5F9]"
        aria-label="Dismiss"
        style={{ color: "#6B7280" }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
