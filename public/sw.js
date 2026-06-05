const CACHE_NAME = "researchvy-v1";
const OFFLINE_URL = "/offline";

const PRECACHE = [
  "/offline",
  "/icon.png",
  "/apple-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin, API routes, and Next.js internals
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && event.request.mode === "navigate") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        if (event.request.mode === "navigate") {
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
        }

        return new Response("Network unavailable", { status: 503 });
      })
  );
});

// ── Web Push ───────────────────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: "Researchvy", body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Researchvy", {
      body:             payload.body  ?? "",
      icon:             payload.icon  ?? "/icon.png",
      badge:            payload.badge ?? "/icon.png",
      data:             { href: payload.href ?? "/" },
      tag:              payload.href  ?? "researchvy",
      renotify:         true,
      requireInteraction: false,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification.data?.href ?? "/";
  const url  = new URL(href, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url === url && "focus" in w) return w.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
