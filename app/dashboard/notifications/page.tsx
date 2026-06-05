import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { redirect } from "next/navigation";
import { NotificationCenterClient } from "./NotificationCenterClient";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { PushPermission } from "@/components/notifications/PushPermission";

export const metadata = generatePageMetadata({ title: "Notifications", noIndex: true });
export const dynamic  = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard/notifications");

  const admin = createSupabaseAdminClient();
  const { data: notifications } = await admin
    .from("notifications")
    .select("id, type, title, body, href, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Notifications
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
          Deadline reminders, event alerts, and platform updates
        </p>
      </div>

      {/* Push opt-in */}
      <PushPermission />

      {/* Notification list */}
      <NotificationCenterClient initialNotifications={notifications ?? []} />

      {/* Preferences */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "#F9FAFB" }}>
          Notification Settings
        </h2>
        <NotificationPreferences />
      </div>
    </div>
  );
}
