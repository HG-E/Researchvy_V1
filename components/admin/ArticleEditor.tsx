"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, RotateCcw, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import type { InsightCategory } from "@/types";

const CATEGORIES: { value: InsightCategory; label: string }[] = [
  { value: "scholarly-visibility",     label: "Scholarly Visibility"      },
  { value: "research-intelligence",    label: "Research Intelligence"     },
  { value: "scholarly-communication",  label: "Scholarly Communication"   },
  { value: "modern-scholarly-systems", label: "Modern Scholarly Systems"  },
  { value: "institutional-positioning",label: "Institutional Positioning" },
];

export type ArticleEditorDefaults = {
  title:          string;
  excerpt:        string;
  featured_image: string | null;
  body_md:        string;
  category:       string;
  tags:           string[];
  reading_time:   number;
  published_at:   string;
};

export type ArticleEditorSaved = {
  title:          string | null;
  excerpt:        string | null;
  featured_image: string | null;
  body_md:        string | null;
  category:       string | null;
  tags:           string[] | null;
  reading_time:   number | null;
  published_at:   string | null;
  is_published:   boolean;
  view_count:     number;
  share_count:    number;
  updated_at:     string | null;
} | null;

export function ArticleEditor({
  slug,
  mdxDefaults,
  savedMeta,
}: {
  slug:        string;
  mdxDefaults: ArticleEditorDefaults;
  savedMeta:   ArticleEditorSaved;
}) {
  const router = useRouter();

  // Merge: saved values override MDX defaults
  const merge = <T,>(saved: T | null | undefined, fallback: T): T =>
    saved !== null && saved !== undefined ? saved : fallback;

  const [title,          setTitle]         = useState(merge(savedMeta?.title,          mdxDefaults.title));
  const [excerpt,        setExcerpt]       = useState(merge(savedMeta?.excerpt,        mdxDefaults.excerpt));
  const [featuredImage,  setFeaturedImage] = useState(merge(savedMeta?.featured_image, mdxDefaults.featured_image ?? ""));
  const [bodyMd,         setBodyMd]        = useState(merge(savedMeta?.body_md,        mdxDefaults.body_md));
  const [category,       setCategory]      = useState(merge(savedMeta?.category,       mdxDefaults.category));
  const [tagsInput,      setTagsInput]     = useState(merge(savedMeta?.tags?.join(", "), mdxDefaults.tags.join(", ")));
  const [readingTime,    setReadingTime]   = useState(merge(savedMeta?.reading_time,   mdxDefaults.reading_time));
  const [publishedAt,    setPublishedAt]   = useState(
    merge(savedMeta?.published_at, mdxDefaults.published_at).slice(0, 10)
  );
  const [isPublished, setIsPublished] = useState(savedMeta?.is_published ?? true);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res  = await fetch(`/api/admin/articles/${slug}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:          title         || null,
          excerpt:        excerpt       || null,
          featured_image: featuredImage || null,
          body_md:        bodyMd        || null,
          category:       category      || null,
          tags:           tags.length   ? tags : null,
          reading_time:   readingTime   || null,
          published_at:   publishedAt   ? new Date(publishedAt).toISOString() : null,
          is_published:   isPublished,
        }),
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Save failed");
      }

      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
      setStatus("error");
    }
  }

  function handleReset() {
    setTitle(mdxDefaults.title);
    setExcerpt(mdxDefaults.excerpt);
    setFeaturedImage(mdxDefaults.featured_image ?? "");
    setBodyMd(mdxDefaults.body_md);
    setCategory(mdxDefaults.category);
    setTagsInput(mdxDefaults.tags.join(", "));
    setReadingTime(mdxDefaults.reading_time);
    setPublishedAt(mdxDefaults.published_at.slice(0, 10));
    setIsPublished(true);
    setStatus("idle");
  }

  const wordCount = bodyMd.split(/\s+/).filter(Boolean).length;
  const autoRead  = Math.max(1, Math.ceil(wordCount / 200));

  const inputClass  = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1 focus:ring-[#2563EB]";
  const inputStyle  = { backgroundColor: "#0A1120", borderColor: "#1E293B", color: "#F9FAFB", border: "1px solid #1E293B" };
  const labelStyle  = { color: "#9CA3AF" };

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Admin › Content › {slug}
          </p>
          <h1 className="text-2xl font-bold truncate" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            {title || slug}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/insights/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium border transition-colors hover:bg-[#1E293B]"
            style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live
          </a>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium border transition-colors hover:bg-[#1E293B]"
            style={{ borderColor: "#1E293B", color: "#4B5563" }}
            title="Reset all fields to the original MDX file values"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to MDX
          </button>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: status === "saved" ? "#10B981" : "#2563EB" }}
          >
            {status === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : status === "saved" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm border" style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Metadata panel */}
      <div className="rounded-2xl border p-6 mb-4 space-y-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4B5563" }}>Metadata</p>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="Article title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Short summary shown in article cards and SEO description"
          />
        </div>

        {/* Row: Category + Tags + Reading time + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Tags (comma-separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
              Reading Time (min)
              <span className="ml-1 font-normal" style={{ color: "#4B5563" }}>auto: {autoRead}</span>
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={readingTime}
              onChange={(e) => setReadingTime(Number(e.target.value))}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Published Date</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />
          </div>
        </div>

        {/* Featured image + Published toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Featured Image URL</label>
            <input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://example.com/image.jpg"
            />
            {featuredImage && (
              <div className="mt-2 rounded-xl overflow-hidden border" style={{ borderColor: "#1E293B", maxHeight: "120px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt="Featured preview" className="w-full object-cover" style={{ maxHeight: "120px" }} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pb-2.5">
            <button
              onClick={() => setIsPublished((v) => !v)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-colors duration-150"
              style={{
                backgroundColor: isPublished ? "#2563EB" : "#1E293B",
                borderColor:     isPublished ? "#2563EB" : "#334155",
              }}
              role="switch"
              aria-checked={isPublished}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150"
                style={{ transform: isPublished ? "translateX(20px)" : "translateX(2px)", marginTop: "1px" }}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: isPublished ? "#F9FAFB" : "#6B7280" }}>
              {isPublished ? "Published" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      {/* Body editor */}
      <div className="rounded-2xl border p-6 mb-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4B5563" }}>
            Article Body (Markdown)
          </p>
          <span className="text-[11px]" style={{ color: "#1E3A5F" }}>
            {wordCount.toLocaleString()} words &middot; ~{autoRead} min read
          </span>
        </div>
        <textarea
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          rows={28}
          className="w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors focus:ring-1 focus:ring-[#2563EB]"
          style={{
            backgroundColor: "#080E1A",
            border:           "1px solid #1E293B",
            color:            "#D1D5DB",
            resize:           "vertical",
            lineHeight:       "1.7",
          }}
          placeholder="Write your article in Markdown here…"
          spellCheck={false}
        />
        <p className="mt-2 text-[11px]" style={{ color: "#1E3A5F" }}>
          Supports standard Markdown (headings, bold, italic, lists, links, code blocks). Changes are saved to the database and go live immediately after saving.
        </p>
      </div>

      {/* Stats footer */}
      {savedMeta && (
        <div className="flex items-center gap-6 flex-wrap px-1">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#4B5563" }}>
            <Eye className="h-3.5 w-3.5" />
            {(savedMeta.view_count ?? 0).toLocaleString()} views
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#4B5563" }}>
            {/* Share icon inline */}
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            {(savedMeta.share_count ?? 0).toLocaleString()} shares
          </span>
          {savedMeta.updated_at && (
            <span className="text-xs" style={{ color: "#1E3A5F" }}>
              Last saved: {new Date(savedMeta.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
