import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { format } from "date-fns";
import { Building2, AlertCircle, Users, Mail, Inbox } from "lucide-react";
import { PartnershipStatusSelect } from "@/components/admin/PartnershipStatusSelect";

export const dynamic = "force-dynamic";
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

function parseResearcherCount(s: string): number {
  const m = (s ?? "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function getScale(s: string): { label: string; color: string; bg: string } {
  const n = parseResearcherCount(s);
  if (n >= 200) return { label: "Large",  color: "#F472B6", bg: "rgba(219,39,119,0.12)" };
  if (n >= 50)  return { label: "Mid",    color: "#A78BFA", bg: "rgba(139,92,246,0.12)" };
  if (n >= 10)  return { label: "Small",  color: "#60A5FA", bg: "rgba(37,99,235,0.12)"  };
  return             { label: "Micro",   color: "#9CA3AF", bg: "rgba(107,114,128,0.1)"  };
}

const STATUS_COLOR: Record<string, string> = {
  new:         "#F59E0B",
  contacted:   "#2563EB",
  in_progress: "#8B5CF6",
  closed:      "#6B7280",
};

function getStatusColor(s: string): string {
  return STATUS_COLOR[s] ?? "#2563EB";
}

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  "scholarly-visibility":     { bg: "rgba(37,99,235,0.12)",  text: "#60A5FA" },
  "research-intelligence":    { bg: "rgba(124,58,237,0.12)", text: "#A78BFA" },
  "scholarly-communication":  { bg: "rgba(5,150,105,0.12)",  text: "#34D399" },
  "training-and-development": { bg: "rgba(217,119,6,0.12)",  text: "#FCD34D" },
  "full-access":              { bg: "rgba(219,39,119,0.12)", text: "#F472B6" },
};

function getInterestStyle(s: string) {
  return INTEREST_COLORS[s] ?? { bg: "rgba(107,114,128,0.1)", text: "#9CA3AF" };
}

function formatInterestArea(s: string): string {
  return s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default async function PartnershipEnquiriesPage() {
  const { rows, error } = await getEnquiries();

  const newCount       = rows.filter((r) => r.status === "new").length;
  const contactedCount = rows.filter((r) => r.status === "contacted").length;
  const totalReach     = rows.reduce((sum, r) => sum + parseResearcherCount(r.researcher_count), 0);

  return (
    <div>
      {/* Header */}
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
          {rows.length} institutional enquiry{rows.length !== 1 ? "s" : ""} · manage institutional partnerships and access deals
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

      {/* Stats strip */}
      {!error && rows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Leads",       value: rows.length,      icon: Inbox,     color: "#60A5FA" },
            { label: "New",               value: newCount,          icon: AlertCircle, color: "#F59E0B" },
            { label: "Contacted",         value: contactedCount,    icon: Mail,      color: "#A78BFA" },
            { label: "Researcher Reach",  value: `${totalReach}+`, icon: Users,     color: "#34D399" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border px-4 py-3"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-3.5 w-3.5" style={{ color }} />
                <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <Building2 className="h-8 w-8 mx-auto mb-3" style={{ color: "#2563EB" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "#F9FAFB" }}>No partnership enquiries yet</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Enquiries submitted via the partnerships page will appear here.
          </p>
        </div>
      )}

      {!error && rows.length > 0 && (
        <div className="space-y-4">
          {rows.map((row) => {
            const scale         = getScale(row.researcher_count);
            const statusColor   = getStatusColor(row.status);
            const interestStyle = getInterestStyle(row.interest_area);

            return (
              <div
                key={row.id}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                {/* Status accent bar */}
                <div className="h-[3px] w-full" style={{ backgroundColor: statusColor }} />

                {/* Card body */}
                <div className="px-6 py-5">
                  {/* Top row: institution + actions */}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <h2 className="text-base font-bold" style={{ color: "#F9FAFB" }}>
                          {row.institution}
                        </h2>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scale.bg, color: scale.color }}
                        >
                          {scale.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#4B5563" }}>
                        {row.contact_name}
                        <span className="mx-1.5" style={{ color: "#1E3A5F" }}>·</span>
                        <a
                          href={`mailto:${row.contact_email}`}
                          className="hover:underline"
                          style={{ color: "#2563EB" }}
                        >
                          {row.contact_email}
                        </a>
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <a
                        href={`mailto:${row.contact_email}?subject=Re%3A%20Researchvy%20Partnership`}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors hover:bg-[#1E293B] whitespace-nowrap"
                        style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Reply
                      </a>
                      <span className="text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                        {format(new Date(row.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Metadata pills row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}
                    >
                      <Users className="h-3 w-3" />
                      {row.researcher_count} researchers
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: interestStyle.bg, color: interestStyle.text }}
                    >
                      {formatInterestArea(row.interest_area)}
                    </span>
                    <PartnershipStatusSelect id={row.id} initial={row.status} />
                  </div>

                  {/* Message */}
                  {row.message && (
                    <p
                      className="mt-4 pt-4 text-xs leading-relaxed border-t"
                      style={{ color: "#6B7280", borderColor: "#1E293B", whiteSpace: "pre-wrap" }}
                    >
                      {row.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
