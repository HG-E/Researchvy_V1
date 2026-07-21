"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlB64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = window.atob(base64);
  const arr     = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer as ArrayBuffer;
}

type PermState = "unsupported" | "default" | "granted" | "denied" | "loading";

export function PushPermission() {
  const [state,    setState]    = useState<PermState>("loading");
  const [subbed,   setSubbed]   = useState(false);
  const [working,  setWorking]  = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !VAPID_PUBLIC_KEY) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("unsupported");
      return;
    }
    setState(Notification.permission as PermState);

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setSubbed(!!sub))
    );
  }, []);

  async function subscribe() {
    setWorking(true);
    try {
      const permission = await Notification.requestPermission();
      setState(permission as PermState);
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      await fetch("/api/notifications/push-subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });

      setSubbed(true);
    } catch (err) {
      console.error("[push] subscribe error:", err);
    } finally {
      setWorking(false);
    }
  }

  async function unsubscribe() {
    setWorking(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/notifications/push-subscribe", {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubbed(false);
    } finally {
      setWorking(false);
    }
  }

  if (state === "loading")      return null;
  if (state === "unsupported")  return null;

  if (state === "denied") {
    return (
      <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
        <BellOff className="h-4 w-4 flex-shrink-0" style={{ color: "#F87171" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
          Notifications are blocked in your browser.
          Update permissions in your browser settings to enable push notifications.
        </p>
      </div>
    );
  }

  if (subbed) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
        style={{ backgroundColor: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Push notifications enabled — deadline reminders will arrive on this device.
          </p>
        </div>
        <button
          onClick={unsubscribe}
          disabled={working}
          className="text-xs font-medium flex-shrink-0 transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ color: "#4B5563" }}
        >
          {working ? "…" : "Disable"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
      <div className="flex items-center gap-2 min-w-0">
        <Bell className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
          Enable push notifications to get deadline reminders even when Researchvy isn&apos;t open.
        </p>
      </div>
      <button
        onClick={subscribe}
        disabled={working || !VAPID_PUBLIC_KEY}
        className="flex items-center gap-1.5 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all duration-150 disabled:opacity-50"
        style={{ backgroundColor: "#2563EB" }}
      >
        {working ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
        Enable
      </button>
    </div>
  );
}
