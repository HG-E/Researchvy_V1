import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { WaitlistNotifyToggle } from "@/components/admin/WaitlistNotifyToggle";
import { format } from "date-fns";
import { Users } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Clinic Waitlist" });

interface WaitlistEntry {
  id:          string;
  name:        string;
  email:       string;
  clinic_slug: string;
  notified:    boolean;
  created_at:  string;
}

async function getWaitlist(): Promise<{ entries: WaitlistEntry[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("clinic_waitlist")
      .select("id, name, email, clinic_slug, notified, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { entries: [], error: true };
    return { entries: (data ?? []) as WaitlistEntry[], error: false };
  } catch {
    return { entries: [], error: true };
  }
}

export default async function WaitlistPage() {
  const { entries, error } = await getWaitlist();
  const pending = entries.filter((e) => !e.notified).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Waitlist
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Clinic Waitlist
          </h1>
          {pending > 0 && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#93C5FD" }}
            >
              {pending} to notify
            </span>
          )}
        </div>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {entries.length} total · mark as notified when the next cohort opens
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Could not load waitlist. Make sure you have run the <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}>clinic_waitlist</code> SQL migration in Supabase.
          </p>
        </div>
      )}

      {!error && entries.length === 0 && (
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <Users className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
          <p className="text-sm" style={{ color: "#4B5563" }}>No waitlist signups yet.</p>
          <p className="text-xs mt-1" style={{ color: "#374151" }}>
            The waitlist form appears on the clinic banner once registration closes.
          </p>
        </div>
      )}

      {!error && entries.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
          <div
            className="grid gap-4 px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b"
            style={{
              gridTemplateColumns: "1fr 200px 110px 140px",
              backgroundColor:    "#0F172A",
              borderColor:        "#1E293B",
              color:              "#4B5563",
            }}
          >
            <span>Contact</span>
            <span className="hidden md:block">Clinic</span>
            <span>Joined</span>
            <span>Status</span>
          </div>

          <div style={{ backgroundColor: "#0F172A" }}>
            {entries.map((row, i) => (
              <div
                key={row.id}
                className="grid gap-4 items-center px-6 py-4 border-b last:border-b-0"
                style={{
                  gridTemplateColumns: "1fr 200px 110px 140px",
                  borderBottomColor:   "#1E293B",
                  borderLeftWidth:     "3px",
                  borderLeftStyle:     "solid",
                  borderLeftColor:     row.notified ? "#1E293B" : "#2563EB",
                  backgroundColor:     i % 2 === 0 ? "#0F172A" : "#0A1120",
                }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>{row.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#4B5563" }}>{row.email}</p>
                </div>

                <span className="hidden md:block text-xs truncate" style={{ color: "#6B7280" }}>
                  {row.clinic_slug}
                </span>

                <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                  {format(new Date(row.created_at), "MMM d, yyyy")}
                </span>

                <WaitlistNotifyToggle id={row.id} initial={row.notified} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
