import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import type { HeaderUser } from "@/components/layout/UserButton";

async function getHeaderUser(): Promise<HeaderUser | null> {
  try {
    const user = await getServerUser();
    if (!user) return null;

    const admin = createSupabaseAdminClient();
    const { data: profile } = await admin
      .from("users")
      .select("full_name, avatar_url, role")
      .eq("id", user.id)
      .single();

    return {
      id:         user.id,
      name:       profile?.full_name || (user.user_metadata?.full_name as string | undefined) || null,
      email:      user.email ?? "",
      role:       profile?.role ?? "user",
      avatar_url: profile?.avatar_url ?? (user.user_metadata?.avatar_url as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const headerUser = await getHeaderUser();

  return (
    <>
      <Header serverUser={headerUser} />
      <div className="flex-1">{children}</div>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
