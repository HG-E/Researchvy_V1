import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, Calendar, BookOpen, Award } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ certId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certId } = await params;
  return {
    title: `Certificate ${certId} — Researchvy Academy`,
    description: "Verify a Researchvy Academy completion certificate",
  };
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations", 2: "Intermediate", 3: "Advanced",
  4: "Expert", 5: "Master",
};

export default async function VerifyCertPage({ params }: Props) {
  const { certId } = await params;

  // Parse: RVY-XXXXXXXX → 8-char hex code (= first 8 chars of enrollment UUID)
  const match = certId.toUpperCase().match(/^RVY-([A-Z0-9]{8})$/);
  if (!match) notFound();
  const code = match[1].toLowerCase();

  const admin = createSupabaseAdminClient();

  // Find matching completed enrollment — UUID starts with this code
  const { data: enrollments } = await admin
    .from("enrollments")
    .select("id, completed_at, tier, user_id, course_id")
    .filter("id::text", "ilike", `${code}%`)
    .not("completed_at", "is", null)
    .limit(1);

  const enrollment = enrollments?.[0];
  if (!enrollment) notFound();

  // Fetch course and researcher in parallel
  const [{ data: course }, { data: profile }] = await Promise.all([
    admin.from("courses").select("title, slug, level").eq("id", enrollment.course_id).single(),
    admin.from("users").select("full_name").eq("id", enrollment.user_id).maybeSingle(),
  ]);

  if (!course) notFound();

  const researcherName = (profile?.full_name as string | null) || "Researcher";
  const completedDate = new Date(enrollment.completed_at!).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const levelLabel = LEVEL_LABELS[course.level] ?? `Level ${course.level}`;
  const normalizedCertId = `RVY-${code.toUpperCase()}`;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0A0F1A" }}>
      <div className="w-full max-w-2xl space-y-8">
        {/* Verification badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#14532d", color: "#86efac" }}>
            <CheckCircle className="h-4 w-4" />
            Certificate Verified
          </div>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            This is an authentic Researchvy Academy completion certificate
          </p>
        </div>

        {/* Certificate card */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          {/* Certificate header */}
          <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: "#1E293B" }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#1E293B" }}>
                <Award className="h-8 w-8" style={{ color: "#60A5FA" }} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>
              Certificate of Completion
            </p>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>
              {researcherName}
            </h1>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              has successfully completed
            </p>
          </div>

          {/* Course info */}
          <div className="px-8 py-6 text-center border-b" style={{ borderColor: "#1E293B" }}>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider"
                style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}>
                {levelLabel}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-2" style={{ color: "#E2E8F0" }}>
              {course.title}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Researchvy Academy
            </p>
          </div>

          {/* Meta details */}
          <div className="px-8 py-5 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <Calendar className="h-3.5 w-3.5" />
                Completed
              </div>
              <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>{completedDate}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <Shield className="h-3.5 w-3.5" />
                Certificate ID
              </div>
              <p className="text-sm font-mono font-medium" style={{ color: "#D1D5DB" }}>{normalizedCertId}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <BookOpen className="h-3.5 w-3.5" />
                Issued by
              </div>
              <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>Researchvy Academy</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <CheckCircle className="h-3.5 w-3.5" />
                Status
              </div>
              <p className="text-sm font-medium" style={{ color: "#86efac" }}>Valid &amp; Authentic</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t flex items-center justify-between"
            style={{ borderColor: "#1E293B", backgroundColor: "#070B14" }}>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Verified at researchvy.com/verify/{normalizedCertId}
            </p>
            <Link href={`/academy/courses/${course.slug}`}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}>
              View course
            </Link>
          </div>
        </div>

        {/* Trust footer */}
        <div className="text-center space-y-2">
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Researchvy Academy trains researchers to communicate impact, attract funding, and build international visibility.
          </p>
          <Link href="/" className="text-xs" style={{ color: "#60A5FA" }}>
            researchvy.com
          </Link>
        </div>
      </div>
    </main>
  );
}
