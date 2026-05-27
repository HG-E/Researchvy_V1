"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Filter, Crown, Shield, CheckCircle2, XCircle, Flag } from "lucide-react";
import { UserActionsMenu } from "@/components/admin/UserActionsMenu";

export type UserRow = {
  id:              string;
  email:           string;
  full_name:       string;
  role:            string;
  created_at:      string;
  last_sign_in_at: string | null;
  banned_until:    string | null;
  flagged:         boolean;
  flagged_reason:  string | null;
  email_confirmed: boolean;
  is_super:        boolean;
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:      { bg: "rgba(239,68,68,0.12)",   text: "#FCA5A5" },
  partner:    { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  researcher: { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  user:       { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

function isSuspended(u: UserRow) {
  return !!(u.banned_until && new Date(u.banned_until) > new Date());
}

interface Props {
  users:          UserRow[];
  currentUserId:  string;
  callerIsSuper:  boolean;
}

export function UsersTable({ users, currentUserId, callerIsSuper }: Props) {
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState("all");
  const [statusFilter,setStatusFilter]= useState<"all" | "suspended" | "flagged" | "unverified">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      if (q && !u.email.toLowerCase().includes(q) && !u.full_name.toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter === "suspended" && !isSuspended(u))    return false;
      if (statusFilter === "flagged"   && !u.flagged)          return false;
      if (statusFilter === "unverified"&& u.email_confirmed)   return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: "#4B5563" }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2 text-sm border outline-none focus:ring-1 focus:ring-blue-500"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#F9FAFB" }}
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs border outline-none focus:ring-1 focus:ring-blue-500"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#D1D5DB" }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="partner">Partner</option>
            <option value="researcher">Researcher</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-xl px-3 py-2 text-xs border outline-none focus:ring-1 focus:ring-blue-500"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#D1D5DB" }}
        >
          <option value="all">All Statuses</option>
          <option value="unverified">Unverified</option>
          <option value="flagged">Flagged</option>
          <option value="suspended">Suspended</option>
        </select>

        <span className="ml-auto text-xs" style={{ color: "#4B5563" }}>
          {filtered.length} / {users.length}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <p className="text-sm" style={{ color: "#4B5563" }}>No users match your filters.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          <div
            className="grid gap-4 px-5 py-3 text-xs font-semibold tracking-wider uppercase border-b"
            style={{
              gridTemplateColumns: "1fr 110px 50px 90px 100px 90px 40px",
              backgroundColor:     "#0F172A",
              borderColor:         "#1E293B",
              color:               "#4B5563",
            }}
          >
            <span>User</span>
            <span>Role</span>
            <span className="hidden lg:block">Verified</span>
            <span className="hidden lg:block">Status</span>
            <span className="hidden md:block">Last sign in</span>
            <span>Joined</span>
            <span />
          </div>

          <div style={{ backgroundColor: "#0F172A" }}>
            {filtered.map((user, i) => {
              const roleStyle  = ROLE_COLORS[user.role] ?? ROLE_COLORS.user;
              const suspended  = isSuspended(user);
              const isSelf     = user.id === currentUserId;

              return (
                <div
                  key={user.id}
                  className="grid gap-4 items-center px-5 py-3.5 border-b last:border-0"
                  style={{
                    gridTemplateColumns: "1fr 110px 50px 90px 100px 90px 40px",
                    borderColor:         "#1E293B",
                    backgroundColor:     i % 2 === 0 ? "#0F172A" : "#0A1120",
                    opacity:             suspended ? 0.65 : 1,
                  }}
                >
                  {/* Email + name + super badge */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                        {user.full_name || user.email}
                      </p>
                      {user.is_super && (
                        <span title="Platform Owner · Super Admin">
                          <Crown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#FCD34D" }} />
                        </span>
                      )}
                    </div>
                    {user.full_name && (
                      <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                        {user.email}
                      </p>
                    )}
                    <p className="text-[10px] font-mono mt-0.5 truncate" style={{ color: "#1E3A5F" }}>
                      {user.id}
                    </p>
                  </div>

                  {/* Role badge */}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                  >
                    {user.is_super
                      ? <Crown className="h-3 w-3" />
                      : user.role === "admin"
                        ? <Shield className="h-3 w-3" />
                        : null}
                    {user.is_super ? "Super Admin" : user.role}
                  </span>

                  {/* Email verified */}
                  <div className="hidden lg:flex items-center justify-center">
                    {user.email_confirmed ? (
                      <span title="Email verified">
                        <CheckCircle2 className="h-4 w-4" style={{ color: "#10B981" }} />
                      </span>
                    ) : (
                      <span title="Email not verified">
                        <XCircle className="h-4 w-4" style={{ color: "#F59E0B" }} />
                      </span>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="hidden lg:flex items-center gap-1.5">
                    {suspended && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                        style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#F87171" }}
                      >
                        Suspended
                      </span>
                    )}
                    {user.flagged && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                        title={user.flagged_reason ?? ""}
                        style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
                      >
                        <Flag className="h-2.5 w-2.5" />
                        Flagged
                      </span>
                    )}
                    {!suspended && !user.flagged && (
                      <span className="text-xs" style={{ color: "#1E3A5F" }}>Active</span>
                    )}
                  </div>

                  {/* Last sign in */}
                  <span className="hidden md:block text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                    {user.last_sign_in_at
                      ? format(new Date(user.last_sign_in_at), "MMM d, yyyy")
                      : "Never"}
                  </span>

                  {/* Joined */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </span>

                  {/* Actions */}
                  <UserActionsMenu
                    userId={user.id}
                    currentRole={user.role}
                    targetEmail={user.email}
                    targetIsSuper={user.is_super}
                    callerIsSuper={callerIsSuper}
                    emailConfirmed={user.email_confirmed}
                    status={{ isSuspended: suspended, isFlagged: user.flagged, isSelf }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
