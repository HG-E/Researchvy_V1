export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { TaskList, type SessionData, type TaskItem } from "@/components/dashboard/TaskList";

export const metadata = generatePageMetadata({ title: "My Tasks", noIndex: true });

const CLINIC_SLUG = "digital-visibility-clinic";
const COHORT_ID   = "cohort-2026-july";

async function getPageData(userId: string) {
  const admin = createSupabaseAdminClient();

  const [
    { data: enquiry },
    { data: rawTasks },
    { data: unlocks },
    { data: progress },
  ] = await Promise.all([
    admin
      .from("clinic_enquiries")
      .select("status")
      .eq("user_id", userId)
      .eq("clinic_slug", CLINIC_SLUG)
      .maybeSingle(),

    admin
      .from("clinic_session_tasks")
      .select("id, session_number, task_order, title, description, task_type")
      .eq("clinic_slug", CLINIC_SLUG)
      .order("session_number")
      .order("task_order"),

    admin
      .from("clinic_session_unlocks")
      .select("session_number, unlocked_at")
      .eq("clinic_slug", CLINIC_SLUG)
      .eq("cohort_id", COHORT_ID),

    admin
      .from("participant_task_progress")
      .select("task_id, reflection")
      .eq("user_id", userId),
  ]);

  return { enquiry, rawTasks, unlocks, progress };
}

// Session titles — must match constants/clinics.ts sessions array
const SESSION_TITLES: Record<number, string> = {
  1: "ORCID — Your Research Passport",
  2: "LinkedIn — Your Global Academic Presence",
  3: "WordPress — Your Permanent Academic Home",
  4: "Indexing — Google Scholar, Scopus & WoS",
  5: "Publishing Strategy for Nigerian & African Researchers",
};

export default async function TasksPage() {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard/clinics/tasks");

  const { enquiry, rawTasks, unlocks, progress } = await getPageData(user.id);

  const isEnrolled = enquiry?.status === "enrolled";

  if (!isEnrolled) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/clinics"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft className="h-4 w-4" /> My Clinics
        </Link>

        <div
          className="rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
          >
            <Lock className="h-6 w-6" style={{ color: "#2563EB" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
            Tasks are for enrolled participants
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            {enquiry
              ? "Your registration is being reviewed. You'll get access to the task dashboard once you're enrolled."
              : "You haven't registered for the Digital Visibility Clinic yet."}
          </p>
          <Link
            href="/dashboard/clinics"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            Go to My Clinics
          </Link>
        </div>
      </div>
    );
  }

  // Build lookup maps
  const unlockedSessions = new Set<number>(
    (unlocks ?? []).map((u: { session_number: number }) => u.session_number)
  );
  const unlockDates = Object.fromEntries(
    (unlocks ?? []).map((u: { session_number: number; unlocked_at: string }) => [
      u.session_number,
      u.unlocked_at,
    ])
  );
  const completedIds = new Set<string>(
    (progress ?? []).map((p: { task_id: string }) => p.task_id)
  );
  const reflectionMap = Object.fromEntries(
    (progress ?? []).map((p: { task_id: string; reflection: string | null }) => [
      p.task_id,
      p.reflection,
    ])
  );

  // Group tasks into sessions
  const sessionMap: Record<number, TaskItem[]> = {};
  for (const t of rawTasks ?? []) {
    if (!sessionMap[t.session_number]) sessionMap[t.session_number] = [];
    sessionMap[t.session_number].push({
      id:           t.id,
      title:        t.title,
      description:  t.description ?? null,
      task_type:    t.task_type as "action" | "reflection",
      task_order:   t.task_order,
      is_completed: completedIds.has(t.id),
      reflection:   reflectionMap[t.id] ?? null,
    });
  }

  const sessions: SessionData[] = Object.entries(sessionMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([num, tasks]) => ({
      session_number: Number(num),
      title:          SESSION_TITLES[Number(num)] ?? `Session ${num}`,
      is_unlocked:    unlockedSessions.has(Number(num)),
      unlocked_at:    unlockDates[Number(num)] ?? null,
      tasks,
    }));

  const totalTasks = sessions.reduce((sum, s) => sum + s.tasks.length, 0);
  const doneTasks  = sessions.reduce(
    (sum, s) => sum + s.tasks.filter((t) => t.is_completed).length,
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/dashboard/clinics"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft className="h-4 w-4" /> My Clinics
        </Link>

        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard › Clinics
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          My Tasks
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Digital Visibility Clinic · July 2026 Cohort
        </p>
      </div>

      {unlockedSessions.size === 0 && (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
            Sessions open when your cohort begins
          </h2>
          <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
            Your July 2026 cohort hasn&apos;t started yet. Sessions will unlock one at a time
            as the programme progresses — you&apos;ll get an email each time a new one opens.
          </p>
          <p className="text-xs mb-6" style={{ color: "#374151" }}>
            Questions? Email{" "}
            <a href="mailto:researchvy@gmail.com" style={{ color: "#4B5563" }}>
              researchvy@gmail.com
            </a>
          </p>
          <Link
            href="/dashboard/clinics"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            ← Back to My Clinic
          </Link>
        </div>
      )}

      {unlockedSessions.size > 0 && (
        <TaskList sessions={sessions} totalTasks={totalTasks} doneTasks={doneTasks} />
      )}
    </div>
  );
}
