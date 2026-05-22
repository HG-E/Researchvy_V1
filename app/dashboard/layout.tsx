import { redirect } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getServerUser } from "@/lib/auth/supabase";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#080E1A" }}>
      <DashboardSidebar userEmail={user.email ?? ""} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
        >
          <Logo variant="icon" width={30} />
          <Menu className="h-5 w-5" style={{ color: "#6B7280" }} />
        </header>

        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
