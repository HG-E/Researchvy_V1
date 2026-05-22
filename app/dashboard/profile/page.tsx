import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export const metadata = generatePageMetadata({ title: "My Profile", noIndex: true });

export default async function ProfilePage() {
  const user = await getServerUser();

  const meta = user?.user_metadata ?? {};

  const initialData = {
    email:                    user?.email ?? "",
    full_name:                (meta.full_name as string | undefined) ?? "",
    bio:                      (meta.bio as string | undefined) ?? "",
    orcid:                    (meta.orcid as string | undefined) ?? "",
    google_scholar:           (meta.google_scholar as string | undefined) ?? "",
    institutional_affiliation:(meta.institutional_affiliation as string | undefined) ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ backgroundColor: "#2563EB", color: "#fff" }}
        >
          {initialData.full_name
            ? initialData.full_name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : initialData.email[0]?.toUpperCase() ?? "R"}
        </div>
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-0.5"
            style={{ color: "#2563EB" }}
          >
            Dashboard
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            {initialData.full_name || "My Profile"}
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {initialData.email}
          </p>
        </div>
      </div>

      <ProfileForm initialData={initialData} />
    </div>
  );
}
