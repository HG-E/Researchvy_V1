import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";

export type DashUser = {
  email:      string;
  full_name:  string;
  avatar_url: string | null;
  role:       string;
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard");

  let profile: { full_name: string; avatar_url: string | null; role: string } | null = null;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("users")
      .select("full_name, avatar_url, role")
      .eq("id", user.id)
      .single();
    profile = data ?? null;
  } catch { /* non-fatal */ }

  const dashUser: DashUser = {
    email:      user.email ?? "",
    full_name:  profile?.full_name || (user.user_metadata?.full_name as string) || "",
    avatar_url: profile?.avatar_url ?? null,
    role:       profile?.role ?? "user",
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F9FAFB" }}>
      <DashboardSidebar user={dashUser} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileDashboardNav user={dashUser} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
