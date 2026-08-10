import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { PreClinicLeadActions } from "./PreClinicLeadActions";
import { CAREER_STAGES, PRE_CLINIC_SESSIONS } from "@/constants/preClinic";
import { ArrowLeft, Mail, MessageCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string>   = Object.fromEntries(CAREER_STAGES.map(s => [s.id, s.label]));
const SESSION_LABELS: Record<string, string> = Object.fromEntries(PRE_CLINIC_SESSIONS.map(s => [s.id, s.label]));

interface Registration {
  id:                 string;
  created_at:         string;
  full_name:          string;
  email:              string;
  phone:              string;
  session:            string;
  career_stage:       string;
  field_of_research:  string;
  institution:        string | null;
  source:             string | null;
  status:             string;
  admin_notes:        string | null;
}

async function getRegistration(id: string): Promise<Registration | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("pre_clinic_registrations")
    .select("*")
    .eq("id", id)
    .single();
  return data as Registration | null;
}

export default async function PreClinicRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) notFound();

  const waText = encodeURIComponent(
    `Hi ${reg.full_name.split(" ")[0]}, thanks for registering for the free ORCID Pre-Clinic! Quick question about your ${SESSION_LABELS[reg.session] ?? reg.session} session —`
  );
  const waUrl = `https://wa.me/2347030515183?text=${waText}`;

  return (
    <div>
      {/* Back nav */}
      <Link
        href="/admin/pre-clinic"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Pre-Clinic Registrations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: full profile */}
        <div className="lg:col-span-2 space-y-5">

          {/* Identity card */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-base font-bold" style={{ color: "#F9FAFB" }}>{reg.full_name}</p>
            <p className="text-sm mt-0.5" style={{ color: "#60A5FA" }}>{reg.email}</p>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>{reg.phone}</p>
            <p className="text-xs mt-2" style={{ color: "#4B5563" }}>
              Registered {new Date(reg.created_at).toLocaleDateString("en-GB", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
              {reg.source && ` · from ${reg.source}`}
            </p>
          </div>

          {/* Session + qualification details */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>Registration details</p>
            <div className="space-y-3">
              {[
                ["Session",            SESSION_LABELS[reg.session] ?? reg.session],
                ["Career stage",       STAGE_LABELS[reg.career_stage] ?? reg.career_stage],
                ["Field of research",  reg.field_of_research],
                ["Institution",        reg.institution ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-xs" style={{ color: "#4B5563" }}>{label}</span>
                  <span className="text-xs font-medium text-right" style={{ color: "#D1D5DB" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: actions panel */}
        <div className="space-y-5">

          {/* Quick contact */}
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              Contact this registrant
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${reg.email}`}
                className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1E293B]"
                style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}
              >
                <Mail className="h-4 w-4" style={{ color: "#60A5FA" }} />
                Send email
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp follow-up
                <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
              </a>
              <Link
                href="/clinics"
                target="_blank"
                className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#2563EB", color: "#fff" }}
              >
                Share clinic link
                <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
              </Link>
            </div>
          </div>

          {/* Status + notes — client component */}
          <PreClinicLeadActions
            registrationId={reg.id}
            currentStatus={reg.status}
            currentNotes={reg.admin_notes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
