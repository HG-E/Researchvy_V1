import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";

export const metadata = generatePageMetadata({ title: "My Profile", noIndex: true });

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ orcid_connected?: string; orcid_error?: string }>;
}) {
  const { orcid_connected, orcid_error } = await searchParams;
  const user = await getServerUser();

  const meta = user?.user_metadata ?? {};

  let avatarUrl: string | null = null;
  let username: string | null = null;
  let profilePublic = true;
  if (user?.id) {
    try {
      const admin = createSupabaseAdminClient();
      const { data } = await admin
        .from("users")
        .select("avatar_url, username, profile_public")
        .eq("id", user.id)
        .single();
      avatarUrl     = data?.avatar_url     ?? null;
      username      = data?.username       ?? null;
      profilePublic = data?.profile_public ?? true;
    } catch { /* non-fatal */ }
  }

  const fullName  = (meta.full_name as string | undefined) ?? "";
  const userEmail = user?.email ?? "";

  const initialData = {
    email:                    userEmail,
    full_name:                fullName,
    bio:                      (meta.bio as string | undefined) ?? "",
    orcid:                    (meta.orcid as string | undefined) ?? "",
    orcidVerified:            (meta.orcid_verified as boolean | undefined) ?? false,
    google_scholar:           (meta.google_scholar as string | undefined) ?? "",
    institutional_affiliation:(meta.institutional_affiliation as string | undefined) ?? "",
    username:                 username ?? undefined,
    profile_public:           profilePublic,
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

      {orcid_connected && (
        <div className="rounded-xl border px-4 py-3 text-sm font-medium"
          style={{ backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)", color: "#34D399" }}>
          ✓ ORCID iD connected and verified successfully.
        </div>
      )}
      {orcid_error && (
        <div className="rounded-xl border px-4 py-3 text-sm font-medium"
          style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)", color: "#F87171" }}>
          ✗ {orcid_error}
        </div>
      )}

      <ProfileForm initialData={initialData} />
    </div>
  );
}
