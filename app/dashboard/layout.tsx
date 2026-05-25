import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav";
import { getServerUser } from "@/lib/auth/supabase";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard");

  const email = user.email ?? "";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#080E1A" }}>
      {/* Desktop sidebar */}
      <DashboardSidebar userEmail={email} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile nav (header + slide-in drawer) */}
        <MobileDashboardNav userEmail={email} />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
