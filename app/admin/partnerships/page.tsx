import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { format } from "date-fns";
import { Building2, AlertCircle } from "lucide-react";

export const metadata = generatePageMetadata({ title: "Partnership Enquiries" });

type PartnershipEnquiry = {
  id:               string;
  contact_name:     string;
  contact_email:    string;
  institution:      string;
  researcher_count: string;
  interest_area:    string;
  message:          string | null;
  status:           string;
  created_at:       string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new:         { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  contacted:   { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA" },
  in_progress: { bg: "rgba(139,92,246,0.12)",  text: "#A78BFA" },
  closed:      { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

async function getEnquiries(): Promise<{ rows: PartnershipEnquiry[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("partnership_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { rows: [], error: true };
    return { rows: (data ?? []) as PartnershipEnquiry[], error: false };
  } catch {
    return { rows: [], error: true };
  }
}

export default async function PartnershipEnquiriesPage() {
  const { rows, error } = await getEnquiries();
  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Partnerships
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Partnership Enquiries
          </h1>
          {newCount > 0 && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#FCD34D" }}
            >
              {newCount} new
            </span>
          )}
        </div>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {rows.length} institutional enquiry{rows.length !== 1 ? "s" : ""} via the partnerships form.
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Could not load enquiries. Confirm migration 006 has been run.
          </p>
        </div>
      )}

      {!error && rows.length === 0 && (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <Building2 className="h-8 w-8 mx-auto mb-3" style={{ color: "#2563EB" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "#F9FAFB" }}>No partnership enquiries yet</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>Enquiries submitted via the partnerships page will appear here.</p>
        </div>
      )}

      {!error && rows.length > 0 && (
        <div className="space-y-4">
          {rows.map((row, i) => {
            const statusStyle = STATUS_COLORS[row.status] ?? STATUS_COLORS.new;
            return (
              <div
                key={row.id}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: "#1E293B", backgroundColor: i % 2 === 0 ? "#0F172A" : "#0A1120" }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{row.institution}</p>
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {row.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
                        {row.contact_name} · <a href={`mailto:${row.contact_email}`} style={{ color: "#2563EB" }}>{row.contact_email}</a>
                      </p>
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                      {format(new Date(row.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}>
                      {row.researcher_count} researchers
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}>
                      {row.interest_area}
                    </span>
                  </div>
                </div>
                {row.message && (
                  <div className="px-6 py-4">
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280", whiteSpace: "pre-wrap" }}>
                      {row.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
