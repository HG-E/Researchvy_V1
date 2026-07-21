"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal, ShieldOff, ShieldCheck, Flag, FlagOff,
  Trash2, ChevronDown, Loader2, CheckCircle2,
} from "lucide-react";

type UserStatus = {
  isSuspended: boolean;
  isFlagged:   boolean;
  isSelf:      boolean;
};

const ROLE_OPTIONS = [
  { value: "user",       label: "User",       color: "#9CA3AF" },
  { value: "researcher", label: "Researcher", color: "#60A5FA" },
  { value: "partner",    label: "Partner",    color: "#FCD34D" },
  { value: "admin",      label: "Admin",      color: "#FCA5A5" },
];

export function UserActionsMenu({
  userId,
  currentRole,
  targetEmail: _targetEmail,
  targetIsSuper,
  callerIsSuper,
  emailConfirmed,
  status,
}: {
  userId:        string;
  currentRole:   string;
  targetEmail:   string;
  targetIsSuper: boolean;
  callerIsSuper: boolean;
  emailConfirmed:boolean;
  status:        UserStatus;
}) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"delete" | null>(null);
  const ref    = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirm(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Don't render actions for self, or for super admin unless caller is also super admin
  if (status.isSelf) return null;
  if (targetIsSuper && !callerIsSuper) return (
    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: "#4B5563", backgroundColor: "rgba(107,114,128,0.08)" }}>
      Owner
    </span>
  );

  async function doAction(action: string, extra?: Record<string, unknown>) {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Action failed");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }

  async function doDelete() {
    setLoading("delete");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Delete failed");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(null);
      setOpen(false);
      setConfirm(null);
    }
  }

  const busy = loading !== null;

  // Which role options are available depends on caller privilege
  const availableRoles = ROLE_OPTIONS.filter((r) => {
    if (r.value === currentRole) return false;
    if (r.value === "admin" && !callerIsSuper) return false;
    return true;
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen((v) => !v); setConfirm(null); }}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[#1E293B]"
        style={{ color: "#4B5563" }}
        aria-label="User actions"
        disabled={busy}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 w-56 rounded-xl border p-1.5 shadow-2xl"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", top: "100%" }}
        >
          {/* Suspend / Unsuspend */}
          {status.isSuspended ? (
            <ActionItem icon={ShieldCheck} label="Unsuspend account" color="#10B981" onClick={() => doAction("unsuspend")} />
          ) : (
            <ActionItem icon={ShieldOff} label="Suspend account" color="#F59E0B" onClick={() => doAction("suspend")} />
          )}

          {/* Flag / Unflag */}
          {status.isFlagged ? (
            <ActionItem icon={FlagOff} label="Remove flag" color="#9CA3AF" onClick={() => doAction("unflag")} />
          ) : (
            <ActionItem icon={Flag} label="Flag account" color="#F59E0B" onClick={() => doAction("flag", { reason: "Flagged for review" })} />
          )}

          {/* Verify email — only shown if unconfirmed */}
          {!emailConfirmed && (
            <ActionItem
              icon={CheckCircle2}
              label="Verify email"
              color="#10B981"
              onClick={() => doAction("verify")}
            />
          )}

          {/* Change role */}
          {availableRoles.length > 0 && (
            <>
              <div className="my-1 h-px" style={{ backgroundColor: "#1E293B" }} />
              <p className="px-3 py-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#4B5563" }}>
                Change role
              </p>
              {availableRoles.map((r) => (
                <ActionItem
                  key={r.value}
                  icon={ChevronDown}
                  label={`Set as ${r.label}`}
                  color={r.color}
                  onClick={() => doAction("set_role", { role: r.value })}
                />
              ))}
            </>
          )}

          {/* Delete */}
          <div className="my-1 h-px" style={{ backgroundColor: "#1E293B" }} />
          {confirm === "delete" ? (
            <div className="px-3 py-2">
              <p className="text-xs mb-2" style={{ color: "#F87171" }}>
                Permanently deletes this account. Irreversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={doDelete}
                  className="flex-1 rounded-lg py-1.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-lg py-1.5 text-xs font-medium border"
                  style={{ borderColor: "#334155", color: "#9CA3AF" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <ActionItem icon={Trash2} label="Delete account" color="#F87171" onClick={() => setConfirm("delete")} />
          )}
        </div>
      )}
    </div>
  );
}

function ActionItem({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon:    React.ComponentType<{ className?: string }>;
  label:   string;
  color:   string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#1E293B] text-left"
      style={{ color }}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </button>
  );
}
