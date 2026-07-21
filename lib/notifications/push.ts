import webpush from "web-push";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

let _vapidReady = false;
function ensureVapid() {
  if (_vapidReady) return;
  const pub  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw new Error("VAPID keys not configured");
  webpush.setVapidDetails(
    `mailto:${process.env.RESEND_FROM_EMAIL ?? "hello@researchvy.com"}`,
    pub,
    priv,
  );
  _vapidReady = true;
}

export interface PushPayload {
  title: string;
  body:  string;
  href?: string;
  icon?: string;
  badge?: string;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  ensureVapid();
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
  ensureVapid();
  const admin = createSupabaseAdminClient();
  // Paginate to avoid loading unbounded rows into memory
  type Sub = { id: string; user_id: string; endpoint: string; p256dh: string; auth_key: string };
  const PAGE_SIZE = 500;
  let from = 0;
  const subs: Sub[] = [];
  while (true) {
    const { data: page } = await admin
      .from("push_subscriptions")
      .select("id, user_id, endpoint, p256dh, auth_key")
      .range(from, from + PAGE_SIZE - 1);
    if (!page?.length) break;
    subs.push(...(page as Sub[]));
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

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
