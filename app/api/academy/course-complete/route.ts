import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getCourseBySlug, getLessonProgressForCourse } from "@/lib/academy/courses";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { course_slug } = await req.json();
    if (!course_slug || typeof course_slug !== "string") {
      return NextResponse.json({ error: "course_slug required" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const course = await getCourseBySlug(course_slug);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const { data: enrollment } = await admin
      .from("enrollments")
      .select("id, completed_at, expires_at")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // Already done — return fast
    if (enrollment.completed_at) {
      return NextResponse.json({ complete: true, enrollment_id: enrollment.id });
    }

    // Check every published lesson is marked complete
    const allLessons = course.modules.flatMap((m) =>
      m.lessons.filter((l) => l.is_published)
    );
    if (!allLessons.length) return NextResponse.json({ complete: false, enrollment_id: enrollment.id });

    const progress = await getLessonProgressForCourse(user.id, allLessons.map((l) => l.id));
    const allDone  = allLessons.every((l) => !!progress[l.id]?.completed_at);

    if (!allDone) {
      return NextResponse.json({ complete: false, enrollment_id: enrollment.id });
    }

    // Atomic mark complete
    const completedAt = new Date().toISOString();
    await admin
      .from("enrollments")
      .update({ completed_at: completedAt })
      .eq("id", enrollment.id);

    // Send email — fire and forget, never block the response
    triggerCompletionEmail({
      userId:      user.id,
      email:       user.email!,
      courseName:  course.title,
      courseSlug:  course_slug,
      courseLevel: course.level,
      enrollmentId: enrollment.id,
      completedAt,
    }).catch(console.error);

    return NextResponse.json({ complete: true, enrollment_id: enrollment.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function triggerCompletionEmail(opts: {
  userId: string;
  email: string;
  courseName: string;
  courseSlug: string;
  courseLevel: number;
  enrollmentId: string;
  completedAt: string;
}) {
  const { Resend }              = await import("resend");
  const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const admin  = createSupabaseAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("full_name")
    .eq("id", opts.userId)
    .maybeSingle();

  const firstName = (profile?.full_name as string | null)?.split(" ")[0] ?? "Researcher";
  const certId    = `RVY-${opts.enrollmentId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const dateStr   = new Date(opts.completedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const LEVEL_COLORS = ["#60A5FA", "#A78BFA", "#34D399", "#FCD34D", "#F472B6"];
  const color = LEVEL_COLORS[Math.min(opts.courseLevel - 1, 4)];
  const nextLevel = opts.courseLevel < 5 ? opts.courseLevel + 1 : null;

  await resend.emails.send({
    from:    "Researchvy Academy <info@researchvy.com>",
    to:      [opts.email],
    cc:      ["researchvy@gmail.com"],
    replyTo: "info@researchvy.com",
    subject: `🎓 You completed "${opts.courseName}" — Researchvy Academy`,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080E1A;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:48px 24px">

  <p style="color:#4B5563;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 40px;text-align:center">
    Researchvy Academy
  </p>

  <!-- Certificate card -->
  <div style="background:#0F172A;border:1px solid #1E293B;border-radius:20px;padding:40px;text-align:center;margin-bottom:32px;border-top:3px solid ${color}">
    <div style="font-size:40px;margin-bottom:16px">🎓</div>
    <p style="color:#6B7280;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px">
      Certificate of Completion
    </p>
    <p style="color:#9CA3AF;font-size:13px;margin:0 0 20px">This certifies that</p>
    <h1 style="color:#F9FAFB;font-size:26px;font-weight:700;margin:0 0 6px">${firstName}</h1>
    <p style="color:#9CA3AF;font-size:13px;margin:0 0 20px">has successfully completed</p>
    <h2 style="color:#F9FAFB;font-size:18px;font-weight:700;margin:0 0 16px">${opts.courseName}</h2>
    <span style="background:${color}18;color:${color};border:1px solid ${color}30;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px">
      Level ${opts.courseLevel}
    </span>
    <div style="border-top:1px solid #1E293B;margin:24px 0"></div>
    <p style="color:#6B7280;font-size:12px;margin:0">Issued ${dateStr}</p>
    <p style="color:#374151;font-size:11px;margin:4px 0 0;letter-spacing:1px">${certId}</p>
  </div>

  <!-- Copy -->
  <div style="text-align:center;margin-bottom:32px">
    <h2 style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0 0 12px">
      You did it, ${firstName}.
    </h2>
    <p style="color:#6B7280;font-size:15px;line-height:1.8;margin:0">
      You've done something most researchers never do —<br>
      committed, showed up, and <strong style="color:#D1D5DB">finished</strong>.<br><br>
      Your scholarly visibility is stronger today than when you started.
    </p>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:40px">
    ${nextLevel
      ? `<a href="https://researchvy.com/academy/courses" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:12px">
           Continue to Level ${nextLevel} →
         </a>`
      : `<a href="https://researchvy.com/academy/courses" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:12px;margin-bottom:12px">
           You've mastered the Academy 🏆
         </a>`
    }
    <br>
    <a href="https://researchvy.com/academy/courses/${opts.courseSlug}/complete"
       style="color:#4B5563;font-size:13px;text-decoration:underline">
      View &amp; share your certificate
    </a>
  </div>

  <div style="border-top:1px solid #1E293B;padding-top:24px;text-align:center">
    <p style="color:#374151;font-size:12px;margin:0;line-height:1.7">
      Researchvy · Making researchers discoverable, globally.<br>
      <a href="https://researchvy.com" style="color:#4B5563;text-decoration:none">researchvy.com</a>
    </p>
  </div>

</div>
</body>
</html>`,
  });
}
