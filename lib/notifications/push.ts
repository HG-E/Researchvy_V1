import webpush from "web-push";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

webpush.setVapidDetails(
  `mailto:${process.env.RESEND_FROM_EMAIL ?? "hello@researchvy.com"}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushPayload {
  title: string;
  body:  string;
  href?: string;
  icon?: string;
  badge?: string;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const admin = createSupabaseAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth_key")
    .eq("user_id", userId);

  if (!subs?.length) return;

  const message = JSON.stringify({
    ...payload,
    icon:  payload.icon  ?? "/icons/icon-192.png",
    badge: payload.badge ?? "/icons/badge-96.png",
  });

  const stale: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          message,
          { TTL: 60 * 60 * 24 } // 24h TTL
        );
      } catch (err: unknown) {
        // 410 Gone = subscription expired; collect for cleanup
        if (err instanceof Error && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
          stale.push(sub.id);
        }
      }
    })
  );

  if (stale.length) {
    await admin.from("push_subscriptions").delete().in("id", stale);
  }
}

export async function sendPushToAll(payload: PushPayload) {
  const admin = createSupabaseAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth_key");

  if (!subs?.length) return;

  const message = JSON.stringify({
    ...payload,
    icon:  payload.icon  ?? "/icons/icon-192.png",
    badge: payload.badge ?? "/icons/badge-96.png",
  });

  const stale: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          message,
          { TTL: 60 * 60 * 24 }
        );
      } catch (err: unknown) {
        if (err instanceof Error && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
          stale.push(sub.id);
        }
      }
    })
  );

  if (stale.length) {
    await admin.from("push_subscriptions").delete().in("id", stale);
  }
}
