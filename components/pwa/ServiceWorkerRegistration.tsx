"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Immediately check for a new SW version on every page load
        // so stale SWs are replaced without waiting for the next navigation.
        registration.update().catch(() => {});

        // When a new SW has installed and is waiting to activate, skip the
        // wait so it takes over all tabs immediately on the next navigation.
        registration.addEventListener("updatefound", () => {
          const incoming = registration.installing;
          if (!incoming) return;
          incoming.addEventListener("statechange", () => {
            if (
              incoming.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New SW waiting — tell it to activate immediately
              incoming.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {});

    // Reload once when the controlling SW changes (new version took over)
    // so the current page picks up fresh assets from the new build.
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  return null;
}
