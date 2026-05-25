import { redirect } from "next/navigation";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/admin");

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#080E1A" }}>
      <AdminSidebar adminEmail={profile.email} adminName={profile.full_name} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
