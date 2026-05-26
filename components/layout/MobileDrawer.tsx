"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ChevronRight, LayoutDashboard, User, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import { mainNav } from "@/constants/navigation";
import type { HeaderUser } from "./UserButton";

interface Props {
  open:       boolean;
  onClose:    () => void;
  serverUser?: HeaderUser | null;
}

export function MobileDrawer({ open, onClose, serverUser }: Props) {
  const [mobileEcoOpen, setMobileEcoOpen] = useState(false);
  const router = useRouter();

  function close() {
    setMobileEcoOpen(false);
    onClose();
  }

  async function handleSignOut() {
    close();
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const displayName = serverUser?.name?.split(" ")[0] ?? serverUser?.email?.split("@")[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "rgba(8,14,26,0.6)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm md:hidden flex flex-col"
            style={{ backgroundColor: "#0A0F1A", borderLeft: "1px solid #1E293B" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 h-16 border-b flex-shrink-0"
              style={{ borderColor: "#1E293B", paddingTop: "env(safe-area-inset-top)", height: "calc(64px + env(safe-area-inset-top))" }}
            >
              <Logo variant="full" width={120} />
              <button
                onClick={close}
                className="flex items-center justify-center w-10 h-10 rounded-lg active:bg-[#1E293B] transition-colors"
                style={{ color: "#6B7280" }}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Signed-in identity strip */}
            {serverUser && (
              <div
                className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <UserAvatar name={serverUser.name} email={serverUser.email} avatarUrl={serverUser.avatar_url} size="sm" />
                <div className="min-w-0">
                  {serverUser.name && (
                    <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
                      {displayName}
                    </p>
                  )}
                  <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                    {serverUser.email}
                  </p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto scroll-contain px-4 py-5 space-y-1" aria-label="Mobile navigation">
              {mainNav.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => setMobileEcoOpen(!mobileEcoOpen)}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors active:bg-[#1E293B]"
                        style={{ color: mobileEcoOpen ? "#F9FAFB" : "#9CA3AF" }}
                      >
                        {item.label}
                        <ChevronRight
                          className="h-4 w-4 transition-transform duration-200"
                          style={{ transform: mobileEcoOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileEcoOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-2 mt-1 space-y-1 pb-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={close}
                                  className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors active:bg-[#1E293B]"
                                >
                                  <div>
                                    <p className="text-sm font-semibold" style={{ color: "#D1D5DB" }}>{child.label}</p>
                                    {child.description && (
                                      <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{child.description}</p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="block rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors active:bg-[#1E293B]"
                    style={{ color: "#9CA3AF" }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Signed-in quick links */}
              {serverUser && (
                <div className="pt-3 mt-3 border-t space-y-1" style={{ borderColor: "#1E293B" }}>
                  <Link href="/dashboard" onClick={close} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:bg-[#1E293B]" style={{ color: "#9CA3AF" }}>
                    <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" onClick={close} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:bg-[#1E293B]" style={{ color: "#9CA3AF" }}>
                    <User className="h-4 w-4 flex-shrink-0" />
                    Profile Settings
                  </Link>
                  {serverUser.role === "admin" && (
                    <Link href="/admin" onClick={close} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:bg-[#1E293B]" style={{ color: "#FCA5A5" }}>
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      Admin Panel
                    </Link>
                  )}
                </div>
              )}
            </nav>

            {/* Footer CTAs */}
            <div
              className="px-5 py-5 border-t space-y-3 flex-shrink-0"
              style={{ borderColor: "#1E293B", paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            >
              {serverUser ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 text-sm font-semibold border transition-colors active:bg-[#1E293B]"
                  style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={close}
                    className="block w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-center border transition-colors active:bg-[#1E293B]"
                    style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/clinics"
                    onClick={close}
                    className="block w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white text-center transition-colors active:opacity-90"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    Join a Clinic →
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
