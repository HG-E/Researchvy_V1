"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 text-xs w-full transition-colors rounded-lg px-2 py-1.5 hover:bg-[#1E293B]"
      style={{ color: "#6B7280" }}
    >
      <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
      Sign out
    </button>
  );
}
