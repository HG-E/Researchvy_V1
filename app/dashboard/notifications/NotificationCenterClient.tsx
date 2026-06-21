"use client";

import { useState } from "react";
import { Bell, Clock, CalendarDays, Briefcase, Info, CheckCheck } from "lucide-react";
import Link from "next/link";

interface Notification {
  id:         string;
  type:       string;
  title:      string;
  body:       string;
  href:       string | null;
  read:       boolean;
  created_at: string;
}

type Filter = "all" | "deadline" | "event" | "system";

function typeIcon(type: string) {
  if (type.startsWith("deadline"))    return <Clock className="h-4 w-4" />;
  if (type === "event_tomorrow")      return <CalendarDays className="h-4 w-4" />;
  if (type === "new_opportunity")     return <Briefcase className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
}

function typeColor(type: string): string {
  if (type === "deadline_1d")     return "#EF4444";
  if (type === "deadline_7d")     return "#F59E0B";
  if (type === "event_tomorrow")  return "#6366F1";
  if (type === "new_opportunity") return "#10B981";
  return "#6B7280";
}

function typeLabel(type: string): string {
  if (type === "deadline_1d")     return "Closing tomorrow";
  if (type === "deadline_7d")     return "7 days left";
  if (type === "event_tomorrow")  return "Event tomorrow";
  if (type === "new_opportunity") return "New opportunity";
  return "System";
}

function matchesFilter(n: Notification, filter: Filter): boolean {
  if (filter === "all")      return true;
  if (filter === "deadline") return n.type.startsWith("deadline");
  if (filter === "event")    return n.type === "event_tomorrow";
  if (filter === "system")   return n.type === "system" || n.type === "new_opportunity";
  return true;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m    = Math.floor(diff / 60000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",      label: "All"       },
  { key: "deadline", label: "Deadlines" },
  { key: "event",    label: "Events"    },
  { key: "system",   label: "System"    },
];

export function NotificationCenterClient({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter,        setFilter]        = useState<Filter>("all");

  const unread   = notifications.filter((n) => !n.read).length;
  const filtered = notifications.filter((n) => matchesFilter(n, filter));

  async function markAllRead() {
    await fetch("/api/notifications/read", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({}),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markOneRead(id: string) {
    if (notifications.find((n) => n.id === id)?.read) return;
    await fetch("/api/notifications/read", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-xl border p-1" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor: active ? "#1E293B" : "transparent",
                  color:           active ? "#F9FAFB" : "#6B7280",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: "#6B7280" }}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read ({unread})
          </button>
        )}
      </div>

      {/* List */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center" style={{ backgroundColor: "#0F172A" }}>
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" style={{ color: "#6B7280" }} />
            <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>No notifications</p>
            <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
              {filter === "all"
                ? "Save opportunities to start receiving deadline reminders."
                : `No ${filter} notifications yet.`}
            </p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const color = typeColor(n.type);
            const inner = (
              <div
                key={n.id}
                className="flex gap-4 px-5 py-4 border-b cursor-pointer transition-colors hover:bg-[#111827]"
                style={{
                  borderColor:   "#1E293B",
                  backgroundColor: i % 2 === 0 ? "#0F172A" : "#0A0F1A",
                  borderLeft:    `3px solid ${n.read ? "transparent" : color}`,
                }}
                onClick={() => markOneRead(n.id)}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {typeIcon(n.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug" style={{ color: n.read ? "#9CA3AF" : "#F9FAFB" }}>
                      {n.title}
                    </p>
                    <span
                      className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {typeLabel(n.type)}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>{n.body}</p>
                  <p className="text-[10px] mt-1.5" style={{ color: "#6B7280" }}>{timeAgo(n.created_at)}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: color }} />
                )}
              </div>
            );

            return n.href ? (
              <Link key={n.id} href={n.href}>{inner}</Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })
        )}
      </div>
    </div>
  );
}
