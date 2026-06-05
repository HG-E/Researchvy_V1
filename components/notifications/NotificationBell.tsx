"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, CheckCheck, Clock, CalendarDays, Briefcase, Info } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

interface Notification {
  id:         string;
  type:       string;
  title:      string;
  body:       string;
  href:       string | null;
  read:       boolean;
  created_at: string;
}

function typeIcon(type: string) {
  if (type.startsWith("deadline"))     return <Clock className="h-3.5 w-3.5" />;
  if (type === "event_tomorrow")       return <CalendarDays className="h-3.5 w-3.5" />;
  if (type === "new_opportunity")      return <Briefcase className="h-3.5 w-3.5" />;
  return <Info className="h-3.5 w-3.5" />;
}

function typeColor(type: string): string {
  if (type === "deadline_1d")      return "#EF4444";
  if (type === "deadline_7d")      return "#F59E0B";
  if (type === "event_tomorrow")   return "#6366F1";
  if (type === "new_opportunity")  return "#10B981";
  return "#6B7280";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m    = Math.floor(diff / 60000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell({ userId }: { userId: string }) {
  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread,        setUnread]        = useState(0);
  const [loading,       setLoading]       = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/notifications");
      const json = await res.json() as { notifications: Notification[]; unread: number };
      setNotifications(json.notifications ?? []);
      setUnread(json.unread ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Real-time: subscribe to new inserts via Supabase Realtime.
  // Requires the notifications table to be enabled for Realtime in Supabase Dashboard
  // (Database → Replication). Falls back to 30s polling if Realtime is not configured.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let realtimeActive = false;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => { realtimeActive = true; fetchNotifications(); }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") realtimeActive = true;
      });

    // 30s polling fallback — fires when Realtime hasn't received anything
    // (table not in Replication list or Realtime disabled). Harmless extra
    // fetch if Realtime is active.
    const poll = setInterval(() => {
      if (!realtimeActive) fetchNotifications();
    }, 30_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [userId, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id?: string) {
    await fetch("/api/notifications/read", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(id ? { id } : {}),
    });
    setNotifications((prev) =>
      prev.map((n) => (!id || n.id === id ? { ...n, read: true } : n))
    );
    setUnread(id ? Math.max(0, unread - 1) : 0);
  }

  async function handleItemClick(n: Notification) {
    if (!n.read) await markRead(n.id);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unread ? ` — ${unread} unread` : ""}`}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[#1E293B]"
        style={{ color: open ? "#F9FAFB" : "#6B7280" }}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold text-white rounded-full min-w-[16px] h-4 px-0.5"
            style={{ backgroundColor: "#EF4444", lineHeight: 1 }}
            aria-hidden="true"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[360px] rounded-2xl border shadow-2xl overflow-hidden z-50"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#1E293B" }}>
            <h3 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={() => markRead()}
                  className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#6B7280" }}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#1E293B] transition-colors"
                style={{ color: "#6B7280" }}
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: "#334155", borderTopColor: "transparent" }} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" style={{ color: "#6B7280" }} />
                <p className="text-sm" style={{ color: "#6B7280" }}>No notifications yet</p>
                <p className="text-xs mt-1" style={{ color: "#4B5563" }}>Deadline reminders will appear here</p>
              </div>
            ) : (
              notifications.map((n) => {
                const color = typeColor(n.type);
                const inner = (
                  <div
                    className="flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-[#1E293B]"
                    style={{ borderLeft: `2px solid ${n.read ? "transparent" : color}` }}
                    onClick={() => handleItemClick(n)}
                  >
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {typeIcon(n.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug" style={{ color: n.read ? "#9CA3AF" : "#F9FAFB" }}>
                        {n.title}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: "#6B7280" }}>
                        {n.body}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "#4B5563" }}>
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: color }} />
                    )}
                  </div>
                );

                return n.href ? (
                  <Link key={n.id} href={n.href}>
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2.5" style={{ borderColor: "#1E293B" }}>
            <Link
              href="/dashboard/notifications"
              className="text-xs font-medium transition-colors hover:text-white block text-center"
              style={{ color: "#6B7280" }}
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
