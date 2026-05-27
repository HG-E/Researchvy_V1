import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseMetaForm } from "@/components/admin/academy/CourseMetaForm";
import { ModuleSection } from "@/components/admin/academy/ModuleSection";
import { AddModuleForm } from "@/components/admin/academy/AddModuleForm";

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getServerUser();
  if (!user) redirect("/auth/signin?next=/admin/academy");
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) redirect("/");

  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: course } = await admin
    .from("courses")
    .select(`
      id, title, subtitle, description, level, slug, is_free, is_published,
      thumbnail_url, trailer_url, duration_minutes, position,
      modules (
        id, title, description, position,
        lessons (
          id, title, slug, lesson_type, video_provider, video_id, video_url,
          content_md, duration_seconds, is_free_preview, is_published, position
        )
      )
    `)
    .eq("id", id)
    .single();

  if (!course) notFound();

  const sortedModules = [...(course.modules ?? [])].sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/academy" className="flex items-center gap-1.5" style={{ color: "#60A5FA" }}>
          <ArrowLeft className="h-4 w-4" /> Academy
        </Link>
        <span style={{ color: "#334155" }}>/</span>
        <span className="truncate" style={{ color: "#6B7280" }}>{course.title}</span>
      </div>

      {/* Course metadata editor */}
      <CourseMetaForm course={course} />

      {/* Curriculum */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
            Curriculum
            <span className="ml-2 text-xs font-normal" style={{ color: "#4B5563" }}>
              {sortedModules.length} module{sortedModules.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {sortedModules.length === 0 && (
          <p className="text-sm py-6 text-center rounded-xl border"
            style={{ color: "#4B5563", borderColor: "#1E293B", borderStyle: "dashed" }}>
            No modules yet — add your first module below
          </p>
        )}

        {sortedModules.map(mod => (
          <ModuleSection key={mod.id} mod={mod} />
        ))}

        <AddModuleForm courseId={course.id} />
      </div>
    </div>
  );
}
