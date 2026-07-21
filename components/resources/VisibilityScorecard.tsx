"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowRight, AlertTriangle, TrendingUp, Award, ExternalLink, Mail, Check, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Scorecard data ────────────────────────────────────────────────────────────

const DIMENSIONS = [
  {
    id: "identity",
    label: "Scholar Identity",
    color: "#2563EB",
    maxPoints: 25,
    description: "How coherently your scholarly identity is established across all major platforms.",
    checkpoints: [
      {
        id: "orcid",
        title: "ORCID iD, Verified & Populated",
        maxPoints: 9,
        options: [
          { value: 9, label: "Fully set up: verified email, all works imported, ORCID iD on every paper submission and email signature" },
          { value: 5, label: "Created and verified, most works imported" },
          { value: 2, label: "Created but not verified, few works imported" },
          { value: 0, label: "No ORCID iD, or created but empty/unverified" },
        ],
        cost: "Without a verified ORCID, journals and indexing systems cannot programmatically attribute your publications to you. Citation tracking fails at the source, before it even starts.",
        fix: "15 minutes at orcid.org. Every paper you publish after setup is auto-linked.",
      },
      {
        id: "googlescholar",
        title: "Google Scholar, Claimed & Complete",
        maxPoints: 8,
        options: [
          { value: 8, label: "Claimed, all publications present, verified email, research interests filled, professional photo, institutional homepage linked" },
          { value: 5, label: "Claimed, most publications present, basic setup done" },
          { value: 2, label: "Claimed but incomplete, missing papers, no research interests" },
          { value: 0, label: "No claimed Google Scholar profile" },
        ],
        cost: "Google Scholar is the first result when funders, collaborators, and journalists search your name. A broken or missing profile is your professional introduction to everyone who matters.",
        fix: "Claim your profile, verify your institutional email, and review every paper listed. One hour, done once.",
      },
      {
        id: "scopus",
        title: "Scopus Author Profile, Consolidated",
        maxPoints: 8,
        options: [
          { value: 8, label: "Single Scopus Author ID, all publications correctly attributed, ORCID linked in Scopus" },
          { value: 4, label: "One Scopus profile but some papers missing or misattributed" },
          { value: 0, label: "Multiple Scopus Author IDs exist, my citation count is split across profiles" },
        ],
        cost: "Every duplicate Scopus ID holds a portion of your citation count. Your institution is reporting a lower h-index than your real output justifies, and every promotion panel, grant reviewer, and assessment framework sees that number.",
        fix: "Search your name on Scopus. If you see two records, submit a merge request through the Author Feedback Wizard. Takes 2 minutes to submit; Scopus processes in 4–6 weeks.",
      },
    ],
  },
  {
    id: "discoverability",
    label: "Discoverability Infrastructure",
    color: "#7C3AED",
    maxPoints: 25,
    description: "Whether the global discovery systems researchers use can actually find your work.",
    checkpoints: [
      {
        id: "openaccess",
        title: "Open Access Rate",
        maxPoints: 9,
        options: [
          { value: 9, label: "More than 70% of my publications are freely accessible (Gold OA, Green OA, pre-print, or repository deposit)" },
          { value: 5, label: "40–70% accessible" },
          { value: 2, label: "Less than 40% accessible" },
          { value: 0, label: "Virtually all papers are behind paywalls" },
        ],
        cost: "Researchers without institutional library access, including the majority of practitioners, policymakers, and researchers in the Global South, cannot cite what they cannot access. Paywalled papers attract 25–200% fewer citations than Open Access equivalents.",
        fix: "Check each paper's publisher policy on Sherpa Romeo. For most, you can deposit the accepted manuscript in your institutional repository. Takes 10 minutes per paper.",
      },
      {
        id: "keywords",
        title: "Keywords & Abstract Discoverability",
        maxPoints: 8,
        options: [
          { value: 8, label: "Research interests on all profiles match actual search terms in my field; abstracts clearly state the specific finding and implication in the first two sentences" },
          { value: 4, label: "Partial, keywords are roughly right but abstracts bury the finding" },
          { value: 0, label: "Keywords are generic or copied from journal requirements; abstracts lead with background, not findings" },
        ],
        cost: "Discovery systems surface papers based on abstract text and profile keywords. Mismatched terms mean your paper never appears in the searches of researchers who are specifically looking for work like yours.",
        fix: "Look at 5 papers in your field that get heavily cited. What words do their abstracts and titles use? Use those terms, exactly, in your profiles.",
      },
      {
        id: "repository",
        title: "Institutional Repository Presence",
        maxPoints: 8,
        options: [
          { value: 8, label: "All recent publications deposited with correct metadata, ORCID linked" },
          { value: 4, label: "Some deposited, inconsistent practice" },
          { value: 0, label: "No institutional repository deposits at all" },
        ],
        cost: "Institutional repositories are crawled by Google Scholar, OpenAlex, and BASE, three of the largest academic search systems. Missing from repositories means missing from the searches they power.",
        fix: "Contact your library or research office. Most institutions have a self-deposit portal and a librarian who will help you load your back catalogue.",
      },
    ],
  },
  {
    id: "citationhealth",
    label: "Citation Health",
    color: "#059669",
    maxPoints: 25,
    description: "Whether your citations reflect your real output, or are being lost to attribution and visibility problems.",
    checkpoints: [
      {
        id: "cppratio",
        title: "Citations Per Paper vs. Field Average",
        maxPoints: 9,
        options: [
          { value: 9, label: "My citations-per-paper average is at or above the average for my field" },
          { value: 5, label: "Within 20% below field average" },
          { value: 2, label: "20–50% below field average" },
          { value: 0, label: "More than 50% below field average, or I have no idea what my field average is" },
        ],
        cost: "Being 50% below field average in citations-per-paper typically means your work is published but not being found by the researchers who should be citing it. The quality gap and the visibility gap look identical from the outside.",
        fix: "Calculate your CPP: total citations ÷ total publications. Find your field's average in Scopus Subject Area Metrics. The gap tells you exactly how much visibility is suppressing your impact.",
      },
      {
        id: "hefficiency",
        title: "h-index Efficiency Ratio",
        maxPoints: 8,
        options: [
          { value: 8, label: "My h-index is more than 30% of my total publication count (strong efficiency)" },
          { value: 4, label: "15–30% of publication count" },
          { value: 1, label: "5–15%, significant efficiency gap" },
          { value: 0, label: "Below 5%, my citation record is deeply misaligned with my output" },
        ],
        cost: "A low h-efficiency ratio means most of your papers have few or zero citations, not because they're poor work, but because they're not being discovered. Every paper accumulating no citations is a visibility failure, not a quality failure.",
        fix: "Identify your 5 papers with the most citations and your 5 papers closest to your h-index threshold. These two lists tell you where citation growth is most achievable.",
      },
      {
        id: "alerts",
        title: "Citation Alert System Active",
        maxPoints: 8,
        options: [
          { value: 8, label: "I have active citation alerts on both Google Scholar and Scopus, I know within days when my work is cited" },
          { value: 4, label: "Alerts on one platform only" },
          { value: 0, label: "No citation alerts, I check manually or not at all" },
        ],
        cost: "Without citation alerts, you have no visibility into who is building on your work. You miss collaboration opportunities, fail to engage with your citation network, and have no early-warning system for misattributed citations.",
        fix: "Set up Google Scholar alerts in 2 minutes from your profile page. Set up Scopus alerts from your author profile. Once done, both are automatic forever.",
      },
    ],
  },
  {
    id: "communication",
    label: "Research Communication",
    color: "#D97706",
    maxPoints: 25,
    description: "Whether your research is reaching the audiences beyond the academic community who need it.",
    checkpoints: [
      {
        id: "laysummaries",
        title: "Lay Summary Practice",
        maxPoints: 9,
        options: [
          { value: 9, label: "My major papers each have an accessible lay summary published online and linked from my profiles" },
          { value: 5, label: "Some papers have summaries, inconsistent, not publicly linked" },
          { value: 0, label: "No lay summaries, my output exists in journal format only" },
        ],
        cost: "Practitioners, policymakers, journalists, and the public who need your research cannot read a specialist abstract and turn it into action. The research that changes practice is the research that gets communicated in practice-accessible language.",
        fix: "Write a 300-word plain-language summary for your most-cited paper. Post it on LinkedIn. This takes 45 minutes and creates a communication habit that compounds indefinitely.",
      },
      {
        id: "socialmedia",
        title: "Professional Presence Online",
        maxPoints: 8,
        options: [
          { value: 8, label: "Active LinkedIn and/or academic platform presence; research findings posted regularly; profiles cross-linked to all academic platforms" },
          { value: 4, label: "Profiles exist on major platforms but rarely updated" },
          { value: 0, label: "No professional online presence beyond institutional page" },
        ],
        cost: "Industry partners, policy professionals, and science journalists discover researchers through LinkedIn and academic platforms, not Scopus. If you're not there, they find someone else.",
        fix: "Update your LinkedIn profile this week. Add your current role, a 3-sentence bio written for non-academics, and links to your Google Scholar and ORCID. Post once per month about your research findings.",
      },
      {
        id: "crosssector",
        title: "Cross-Sector Engagement",
        maxPoints: 8,
        options: [
          { value: 8, label: "My research findings have been formally communicated to at least one non-academic audience in the past 2 years (policy brief, media coverage, practitioner event, NGO partnership)" },
          { value: 4, label: "Some engagement but ad hoc, no systematic communication strategy" },
          { value: 0, label: "Research output has never been formally communicated beyond academic journals" },
        ],
        cost: "Research that never crosses into policy, practice, or public debate produces zero real-world impact regardless of its quality. Impact case studies, altmetric scores, and the careers of researchers who want to matter outside their field all depend on this dimension.",
        fix: "Identify one policy body, professional association, or NGO that works in your research area. Write a 2-page briefing on your key finding. Send it to their policy team.",
      },
    ],
  },
];

const TOTAL_MAX = DIMENSIONS.reduce((a, d) => a + d.maxPoints, 0);

function getInterpretation(score: number) {
  if (score >= 85) return {
    label: "Visibility Leader",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.3)",
    summary: "You are doing what most researchers never do. Your visibility infrastructure is strong, your citations reflect your actual output, and your research is reaching beyond the academic community.",
    gap: "Maintain, refine, and scale. The gap between you and the global average is enormous, protect it.",
    clinicTitle: "The advanced module is designed for researchers at your level",
    clinicBody: "Moving from visibility leader to global authority.",
  };
  if (score >= 65) return {
    label: "Emerging",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    summary: "Strong foundations with clear, fixable gaps. You are ahead of most researchers but leaving measurable impact on the table.",
    gap: "A focused 3–6 month effort on your lowest-scoring dimension would produce visible results in citations, collaboration, and institutional standing.",
    clinicTitle: "A structured transformation for your specific profile",
    clinicBody: "Closing the gaps holding your metrics below where your output deserves, with a personalised 12-month visibility strategy.",
  };
  if (score >= 40) return {
    label: "Significant Gaps",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.3)",
    summary: "You are losing citations, collaboration opportunities, and career advancement to visibility problems that are entirely fixable. The gap is large but the fix is systematic, not dependent on producing more research.",
    gap: "Multiple dimensions are suppressing your metrics simultaneously. Fixing them in isolation produces limited results. A structured programme that addresses all dimensions together is significantly more effective than individual fixes.",
    clinicTitle: "This is the most common starting profile",
    clinicBody: "The average participant enters at 38/100 and exits at 79/100 through the Digital Visibility Clinic.",
  };
  return {
    label: "Invisible",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
    summary: "Your research career is running at a fraction of its potential. Your impact is reaching perhaps 20–30% of the audience it should. This is not a reflection of your work's quality, it is a visibility infrastructure problem.",
    gap: "The entire foundation needs to be built or rebuilt. Every dimension is suppressing every other. The good news: researchers at this starting point see the most dramatic transformation.",
    clinicTitle: "The Digital Visibility Clinic was built for exactly this starting position",
    clinicBody: "Session 1 alone, the full visibility audit, produces immediate, measurable changes that compound across the full programme.",
  };
}

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return (
    <div className="w-full rounded-full h-2" style={{ backgroundColor: "#F1F5F9" }}>
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

// ── Share CTA sub-component ───────────────────────────────────────────────────

function ShareScorecard({ score, tierDisplay }: { score: number; tierDisplay: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://researchvy.com/resources/visibility-scorecard";

  const shareText = `I just scored ${score}/100 on the Researcher Visibility Scorecard — ${tierDisplay}. 4 minutes. Eye-opening. Check your own score:`;
  const waShare   = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`;
  const liShare   = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      <p className="text-xs font-semibold mb-3" style={{ color: "#4B5563" }}>
        Know a researcher who needs to see this?
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={waShare}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          <ExternalLink className="h-3 w-3" /> Share on WhatsApp
        </a>
        <a
          href={liShare}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0A66C2" }}
        >
          <ExternalLink className="h-3 w-3" /> Share on LinkedIn
        </a>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all border"
          style={{
            backgroundColor: copied ? "rgba(16,185,129,0.1)" : "transparent",
            borderColor: copied ? "rgba(16,185,129,0.3)" : "#1E293B",
            color: copied ? "#10B981" : "#6B7280",
          }}
        >
          {copied ? <><Check className="h-3 w-3" /> Copied!</> : "Copy link"}
        </button>
      </div>
    </div>
  );
}

// ── Email capture sub-component ───────────────────────────────────────────────

interface EmailCaptureProps {
  leadId:          string | null;
  score:           number;
  answers:         Record<string, number>;
  dimensionScores: Record<string, { score: number; maxPoints: number }>;
  utmSource:       string | null;
}

function EmailCapture({ leadId, score, answers, dimensionScores, utmSource }: EmailCaptureProps) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "done" | "error">("idle");
  const [skipped, setSkipped] = useState(false);

  if (skipped) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      let res: Response;
      if (leadId) {
        // Normal path: auto-save already created the record, just add email
        res = await fetch(`/api/scorecard/${leadId}/claim`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ name, email }),
        });
      } else {
        // Fallback path: auto-save failed or race condition — create full record with email
        res = await fetch("/api/scorecard/submit", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            name,
            email,
            totalScore:      score,
            answers,
            dimensionScores,
            source:          utmSource,
          }),
        });
      }

      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "rgba(16,185,129,0.15)" }}
        >
          <Check className="h-5 w-5" style={{ color: "#10B981" }} />
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Roadmap on its way</p>
        <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
          Check your inbox — your personalised visibility roadmap and booking link are there.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(37,99,235,0.15)" }}
        >
          <Mail className="h-4 w-4" style={{ color: "#60A5FA" }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "#111827" }}>
            Get your personalised roadmap
          </p>
          <p className="text-xs leading-relaxed mt-1" style={{ color: "#4B5563" }}>
            We&apos;ll email your score breakdown, your exact gaps ranked by impact, and a link to
            book a free 20-minute strategy call — no spam, no obligation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: "#FFFFFF",
            border:          "1px solid #1E293B",
            color:           "#F9FAFB",
          }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address *"
          required
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: "#FFFFFF",
            border:          `1px solid ${email ? "#2563EB50" : "#1E293B"}`,
            color:           "#F9FAFB",
          }}
        />
        {status === "error" && (
          <p className="text-xs" style={{ color: "#F87171" }}>
            Something went wrong. Try again or use the WhatsApp button above.
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#2563EB" }}
          >
            {status === "loading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
            ) : (
              <>Send my roadmap <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="text-xs transition-colors hover:text-[#111827]"
            style={{ color: "#4B5563" }}
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const LS_KEY = "rv_scorecard_answers";

function loadSavedAnswers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
  } catch { /* ignore */ }
  return {};
}

export function VisibilityScorecard() {
  const [answers, setAnswers]   = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    identity: true,
    discoverability: false,
    citationhealth: false,
    communication: false,
  });

  // Lead persistence: auto-save on completion, store returned id for email claim
  const [leadId,    setLeadId]    = useState<string | null>(null);
  const [utmSource, setUtmSource] = useState<string | null>(null);
  const hasSavedRef               = useRef(false);
  const prevAnsweredRef           = useRef<Record<string, number>>({});

  // Restore saved answers from localStorage on mount + capture UTM
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUtmSource(p.get("utm_source") ?? p.get("ref") ?? null);

    const saved = loadSavedAnswers();
    if (Object.keys(saved).length === 0) return;
    setAnswers(saved);

    // Auto-open the first dimension that has partial answers so the user can continue
    const newExpanded: Record<string, boolean> = {
      identity: false, discoverability: false, citationhealth: false, communication: false,
    };
    let opened = false;
    for (const dim of DIMENSIONS) {
      const anyAnswered = dim.checkpoints.some(cp => cp.id in saved);
      const allAnswered = dim.checkpoints.every(cp => cp.id in saved);
      if (anyAnswered && !allAnswered && !opened) {
        newExpanded[dim.id] = true;
        opened = true;
      }
    }
    if (!opened) {
      // All complete or none answered — open identity by default
      newExpanded.identity = true;
    }
    setExpanded(newExpanded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist answers to localStorage on every change
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  function answer(checkpointId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [checkpointId]: value }));
  }

  function toggle(dimId: string) {
    setExpanded((prev) => ({ ...prev, [dimId]: !prev[dimId] }));
  }

  const totalScore = Object.values(answers).reduce((a, v) => a + v, 0);
  const answered   = Object.keys(answers).length;
  const totalQ     = DIMENSIONS.flatMap((d) => d.checkpoints).length;
  const complete   = answered === totalQ;
  const interp     = complete ? getInterpretation(totalScore) : null;

  const dimScores = DIMENSIONS.map((d) => ({
    ...d,
    score: d.checkpoints.reduce((a, c) => a + (answers[c.id] ?? 0), 0),
    answeredCount: d.checkpoints.filter((c) => c.id in answers).length,
  }));

  // Build dimension scores object for API
  const dimensionScoresPayload = Object.fromEntries(
    DIMENSIONS.map(d => [
      d.id,
      {
        score: d.checkpoints.reduce((a, c) => a + (answers[c.id] ?? 0), 0),
        maxPoints: d.maxPoints,
      },
    ])
  );

  const weakest = complete
    ? [...dimScores].sort((a, b) => a.score / a.maxPoints - b.score / b.maxPoints)[0]
    : null;

  // Auto-advance: when a dimension is fully answered, open the next one
  useEffect(() => {
    const prev = prevAnsweredRef.current;
    DIMENSIONS.forEach((dim, i) => {
      const wasComplete = dim.checkpoints.every(cp => cp.id in prev);
      const nowComplete = dim.checkpoints.every(cp => cp.id in answers);
      if (!wasComplete && nowComplete && i < DIMENSIONS.length - 1) {
        const nextId = DIMENSIONS[i + 1].id;
        setExpanded(e => e[nextId] ? e : { ...e, [nextId]: true });
      }
    });
    prevAnsweredRef.current = answers;
  }, [answers]);

  // Auto-save anonymous lead when all questions answered; clear localStorage on success
  useEffect(() => {
    if (!complete || hasSavedRef.current) return;
    hasSavedRef.current = true;
    fetch("/api/scorecard/submit", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        answers,
        totalScore,
        dimensionScores: dimensionScoresPayload,
        source: utmSource,
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.id) setLeadId(d.id);
        try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  function retake() {
    setAnswers({});
    setExpanded({ identity: true, discoverability: false, citationhealth: false, communication: false });
    setLeadId(null);
    hasSavedRef.current = false;
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
          Free Diagnostic Tool
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
        >
          The Researcher<br />
          <span style={{ color: "#10B981" }}>Visibility Scorecard</span>
        </h1>
        <p className="text-base leading-relaxed mb-6" style={{ color: "#4B5563" }}>
          12 checkpoints. 4 dimensions. Your exact visibility score, and a precise account
          of what every gap is costing your career right now.
        </p>
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#4B5563" }}>
          {[
            "Takes 4–6 minutes",
            "12 scored checkpoints",
            "Immediate personalised result",
            "No fluff, real data",
          ].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span style={{ color: "#10B981" }}>✓</span> {s}
            </span>
          ))}
        </div>
      </div>

      {/* Resume banner — shown when progress was restored from a previous session */}
      {answered > 0 && !complete && (
        <div
          className="rounded-xl border px-4 py-3 mb-6 flex items-center justify-between gap-3"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#93C5FD" }}>
            <span className="font-semibold" style={{ color: "#111827" }}>Welcome back.</span>
            {" "}Your progress has been restored — {answered} of {totalQ} checkpoints answered.
          </p>
          <button
            onClick={retake}
            className="text-xs whitespace-nowrap flex-shrink-0 transition-colors hover:text-[#111827]"
            style={{ color: "#4B5563" }}
          >
            Start over
          </button>
        </div>
      )}

      {/* Live score bar */}
      {answered > 0 && (
        <div
          className="rounded-2xl border p-5 mb-8 sticky top-4 z-10"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: "#4B5563" }}>
              Your score, {answered}/{totalQ} checkpoints answered
            </span>
            <span className="text-2xl font-bold" style={{ color: "#111827" }}>
              {totalScore}
              <span className="text-sm font-normal ml-1" style={{ color: "#4B5563" }}>/ {TOTAL_MAX}</span>
            </span>
          </div>
          <ScoreBar score={totalScore} max={TOTAL_MAX} color="#10B981" />
          <div className="flex justify-between mt-1.5">
            {[
              { label: "Invisible", at: 0 },
              { label: "Gaps", at: 40 },
              { label: "Emerging", at: 65 },
              { label: "Leader", at: 85 },
            ].map(({ label, at }) => (
              <span key={label} className="text-xs" style={{ color: totalScore >= at ? "#6B7280" : "#2D3748" }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dimensions */}
      <div className="space-y-4 mb-10">
        {dimScores.map((dim) => (
          <div
            key={dim.id}
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: expanded[dim.id] ? dim.color + "60" : "#1E293B" }}
          >
            {/* Dimension header */}
            <button
              className="w-full flex items-center justify-between p-6 text-left"
              onClick={() => toggle(dim.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: dim.color + "18" }}
                >
                  <span className="text-xs font-bold" style={{ color: dim.color }}>
                    {dim.score}/{dim.maxPoints}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#111827" }}>{dim.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>
                    {dim.answeredCount}/{dim.checkpoints.length} answered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="w-24 hidden sm:block">
                  <ScoreBar score={dim.score} max={dim.maxPoints} color={dim.color} />
                </div>
                {expanded[dim.id]
                  ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
                  : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
                }
              </div>
            </button>

            {/* Checkpoints */}
            {expanded[dim.id] && (
              <div className="px-6 pb-6 space-y-6 border-t" style={{ borderColor: "#E2E8F0" }}>
                <p className="text-xs pt-4 leading-relaxed" style={{ color: "#4B5563" }}>{dim.description}</p>

                {dim.checkpoints.map((cp, i) => {
                  const selected = answers[cp.id];
                  const isAnswered = cp.id in answers;

                  return (
                    <div key={cp.id}>
                      {i > 0 && <div className="border-t mb-6" style={{ borderColor: "#E2E8F0" }} />}

                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold leading-snug" style={{ color: "#374151" }}>
                          {cp.title}
                        </p>
                        {isAnswered && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: selected === cp.maxPoints ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)",
                              color: selected === cp.maxPoints ? "#10B981" : "#F87171",
                            }}
                          >
                            {selected}/{cp.maxPoints} pts
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {cp.options.map((opt) => (
                          <label
                            key={opt.value}
                            className="flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-all duration-150"
                            style={{
                              backgroundColor: answers[cp.id] === opt.value
                                ? `${dim.color}14`
                                : "rgba(255,255,255,0.02)",
                              border: `1px solid ${answers[cp.id] === opt.value ? dim.color + "50" : "#1E293B"}`,
                            }}
                          >
                            <input
                              type="radio"
                              name={cp.id}
                              value={opt.value}
                              checked={answers[cp.id] === opt.value}
                              onChange={() => answer(cp.id, opt.value)}
                              className="mt-0.5 flex-shrink-0 accent-[#10B981]"
                            />
                            <span className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Show cost only when answered and score is not perfect */}
                      {isAnswered && selected < cp.maxPoints && (
                        <div
                          className="rounded-xl p-4"
                          style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                        >
                          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "#F87171" }}>
                            <AlertTriangle className="h-3 w-3" /> What this gap is costing you
                          </p>
                          <p className="text-xs leading-relaxed mb-2" style={{ color: "#4B5563" }}>{cp.cost}</p>
                          <p className="text-xs font-medium" style={{ color: "#60A5FA" }}>
                            Quick fix: {cp.fix}
                          </p>
                        </div>
                      )}

                      {isAnswered && selected === cp.maxPoints && (
                        <div
                          className="rounded-xl p-3"
                          style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
                        >
                          <p className="text-xs font-semibold" style={{ color: "#10B981" }}>
                            ✓ Strong, this dimension is working for you
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final result — only shown when complete */}
      {complete && interp && (
        <div className="space-y-6">

          {/* Retake option */}
          <div className="flex justify-end">
            <button
              onClick={retake}
              className="text-xs transition-colors hover:text-[#111827]"
              style={{ color: "#4B5563" }}
            >
              ↺ Start over / Retake
            </button>
          </div>

          {/* Score reveal */}
          <div
            className="rounded-3xl border p-8 text-center"
            style={{ backgroundColor: interp.bg, borderColor: interp.border }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: interp.color }}>
              Your Visibility Score
            </p>
            <div className="text-7xl font-bold mb-2" style={{ color: "#111827", fontFamily: "var(--font-serif)" }}>
              {totalScore}
            </div>
            <div className="text-lg font-semibold mb-4" style={{ color: interp.color }}>
              {interp.label}
            </div>
            <p className="text-sm leading-relaxed max-w-xl mx-auto mb-4" style={{ color: "#4B5563" }}>
              {interp.summary}
            </p>
            <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "#4B5563" }}>
              {interp.gap}
            </p>
          </div>

          {/* Dimension breakdown */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <p className="text-sm font-bold mb-5" style={{ color: "#111827" }}>Your dimension breakdown</p>
            <div className="space-y-4">
              {dimScores.map((d) => {
                const pct = Math.round((d.score / d.maxPoints) * 100);
                return (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: "#4B5563" }}>{d.label}</span>
                      <span className="text-xs font-bold" style={{ color: d.color }}>{d.score}/{d.maxPoints}, {pct}%</span>
                    </div>
                    <ScoreBar score={d.score} max={d.maxPoints} color={d.color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weakest dimension */}
          {weakest && weakest.score < weakest.maxPoints && (
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#FFFFFF", borderColor: weakest.color + "40" }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: weakest.color }}>
                Your Priority Focus
              </p>
              <p className="text-sm font-bold mb-2" style={{ color: "#111827" }}>
                {weakest.label}, your lowest-scoring dimension
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
                This is where the fastest gains are. Improving this single dimension will
                create a chain reaction across your other scores within 3–6 months.
              </p>
              <div className="space-y-2">
                {weakest.checkpoints
                  .filter((c) => (answers[c.id] ?? 0) < c.maxPoints)
                  .map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: weakest.color }} />
                      <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                        <strong style={{ color: "#374151" }}>{c.title}:</strong> {c.fix}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Benchmark comparison */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <p className="text-sm font-bold mb-5 flex items-center gap-2" style={{ color: "#111827" }}>
              <TrendingUp className="h-4 w-4" style={{ color: "#60A5FA" }} />
              How you compare
            </p>
            <div className="space-y-3">
              {[
                { label: "Global researcher average", score: 34, color: "#4B5563" },
                { label: "Your score", score: totalScore, color: interp.color, highlight: true },
                { label: "Digital Visibility Clinic exit average", score: 79, color: "#10B981" },
                { label: "Visibility Leader threshold", score: 85, color: "#2563EB" },
              ].map(({ label, score, color, highlight }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs"
                      style={{ color: highlight ? "#F9FAFB" : "#6B7280", fontWeight: highlight ? 600 : 400 }}
                    >
                      {label}
                    </span>
                    <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
                  </div>
                  <ScoreBar score={score} max={100} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* The clinic CTA */}
          <div
            className="rounded-3xl border p-8 overflow-hidden relative"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />

            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Your Next Step
            </p>
            <h2
              className="text-2xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              {interp.clinicTitle}
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "#4B5563" }}>
              {interp.clinicBody}
            </p>

            <div
              className="rounded-xl border p-4 mb-6 mt-4"
              style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "#93C5FD" }}>
                The Digital Visibility Clinic addresses every dimension in your scorecard, directly:
              </p>
              <div className="space-y-1.5">
                {[
                  ["Session 1", "Scholar Identity: full audit of your Google Scholar, ORCID, and Scopus profiles"],
                  ["Session 2", "Discoverability: keyword strategy, open access optimisation, and citation intelligence"],
                  ["Session 3", "Research Communication + 12-month visibility strategy roadmap tailored to your profile"],
                  ["Session 4", "Bibliometrics and h-index strategy for promotion and grant applications"],
                  ["Session 5", "Research communication for policy, media, and global audiences"],
                ].map(([s, d]) => (
                  <p key={s} className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                    <strong style={{ color: "#BFDBFE" }}>{s}:</strong> {d}
                  </p>
                ))}
              </div>
            </div>

            {/* Urgency strip — August cohort */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: "#EF4444" }} />
              <span className="text-xs font-medium" style={{ color: "#EF4444" }}>
                August 2026 cohort · Limited to 20 researchers · Spots filling now
              </span>
            </div>

            {/* Score-tier-dependent CTAs:
                Low scorers (< 65) need the free consultation as their next step —
                they're not yet ready to commit money on first contact.
                High scorers (≥ 65) are primed to act directly. */}
            <div className="flex flex-wrap gap-3">
              {totalScore < 65 ? (
                <>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    Book a Free Strategy Call
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/clinics/digital-visibility-clinic"
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-[#2563EB] hover:text-[#111827]"
                    style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
                  >
                    View the Clinic
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/clinics/digital-visibility-clinic"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    Claim My Spot in the Clinic
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/clinics/private-consulting"
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-[#8B5CF6] hover:text-[#111827]"
                    style={{ borderColor: "#8B5CF6", color: "#A78BFA" }}
                  >
                    Prefer 1-on-1? Private Consulting
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" style={{ color: "#4B5563" }} />
                <p className="text-xs" style={{ color: "#4B5563" }}>
                  Verified Certificate on completion · ≤20 researchers per cohort
                </p>
              </div>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(`Hi, I scored ${totalScore}/100 on the Researcher Visibility Scorecard and would like to know which option is right for me.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[#111827] flex-shrink-0"
                style={{ color: "#25D366" }}
              >
                <ExternalLink className="h-3 w-3" /> Ask via WhatsApp
              </a>
            </div>
          </div>

          {/* Email capture — optional, below primary CTAs */}
          <EmailCapture
            leadId={leadId}
            score={totalScore}
            answers={answers}
            dimensionScores={dimensionScoresPayload}
            utmSource={utmSource}
          />

          {/* Share CTA — drive more traffic back into the funnel */}
          <ShareScorecard score={totalScore} tierDisplay={interp.label} />

        </div>
      )}

      {/* Progress nudge — shown when partially answered */}
      {answered > 0 && !complete && (
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <p className="text-sm" style={{ color: "#4B5563" }}>
            {totalQ - answered} more {totalQ - answered === 1 ? "checkpoint" : "checkpoints"} to reveal your full score and personalised action plan.
          </p>
        </div>
      )}

    </div>
  );
}
