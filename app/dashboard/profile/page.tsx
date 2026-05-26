import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";

export const metadata = generatePageMetadata({ title: "My Profile", noIndex: true });

export default async function ProfilePage() {
  const user = await getServerUser();

  const meta = user?.user_metadata ?? {};

  let avatarUrl: string | null = null;
  if (user?.id) {
    try {
      const admin = createSupabaseAdminClient();
      const { data } = await admin.from("users").select("avatar_url").eq("id", user.id).single();
      avatarUrl = data?.avatar_url ?? null;
    } catch { /* non-fatal */ }
  }

  const fullName  = (meta.full_name as string | undefined) ?? "";
  const userEmail = user?.email ?? "";

  const initialData = {
    email:                    userEmail,
    full_name:                fullName,
    bio:                      (meta.bio as string | undefined) ?? "",
    orcid:                    (meta.orcid as string | undefined) ?? "",
    google_scholar:           (meta.google_scholar as string | undefined) ?? "",
    institutional_affiliation:(meta.institutional_affiliation as string | undefined) ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          {fullName || "My Profile"}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
          {userEmail}
        </p>
      </div>

      {/* Avatar upload card */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <h2 className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>
          Profile Photo
        </h2>
        <AvatarUpload name={fullName || null} email={userEmail} avatarUrl={avatarUrl} />
      </div>

      <ProfileForm initialData={initialData} />
    </div>
  );
}
