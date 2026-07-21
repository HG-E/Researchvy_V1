"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition, FormEvent } from "react";
import Link from "next/link";
import { Search, CalendarDays, Globe, BookOpen, FileText, Users, ArrowRight } from "lucide-react";
import type { SearchHit } from "./page";

const TYPE_META: Record<SearchHit["type"], { label: string; Icon: React.ElementType; color: string }> = {
  event:       { label: "Events",       Icon: CalendarDays, color: "#2563EB" },
  opportunity: { label: "Opportunities", Icon: Globe,        color: "#10B981" },
  researcher:  { label: "Researchers",  Icon: Users,        color: "#EC4899" },
  course:      { label: "Courses",      Icon: BookOpen,     color: "#8B5CF6" },
  insight:     { label: "Insights",     Icon: FileText,     color: "#F59E0B" },
};

const ORDER: SearchHit["type"][] = ["event", "opportunity", "researcher", "course", "insight"];

interface Props {
  q:       string;
  results: SearchHit[];
}

export function SearchResultsClient({ q, results }: Props) {
  const router     = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef   = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const val = inputRef.current?.value.trim() ?? "";
    if (!val) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(val)}`);
    });
  }

  const grouped = ORDER.reduce<Record<string, SearchHit[]>>((acc, type) => {
    acc[type] = results.filter((r) => r.type === type);
    return acc;
  }, {} as Record<string, SearchHit[]>);

  const total = results.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Global Search
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight" style={{ color: "#111827", fontFamily: "var(--font-serif)" }}>
            Search Researchvy
          </h1>
          <p className="text-sm" style={{ color: "#4B5563" }}>
            Events, opportunities, courses, and insights — all in one place.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
              style={{ color: "#4B5563" }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search events, grants, courses, insights…"
              autoFocus
              autoComplete="off"
              className="w-full rounded-xl border py-4 pl-12 pr-28 text-base outline-none placeholder:text-[#4B5563] focus:ring-2"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor:     "#1E293B",
                color:           "#F9FAFB",
                caretColor:      "#2563EB",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#1E293B")}
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity"
              style={{ backgroundColor: "#2563EB", opacity: isPending ? 0.6 : 1 }}
            >
              {isPending ? "…" : "Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        {q.length >= 2 && (
          <>
            {total === 0 ? (
              <div className="text-center py-20">
                <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "#1E293B" }} />
                <p className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>No results for &ldquo;{q}&rdquo;</p>
                <p className="text-sm" style={{ color: "#4B5563" }}>Try different keywords, or browse the boards below.</p>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {[
                    { href: "/events",        label: "Browse Events"        },
                    { href: "/opportunities", label: "Browse Opportunities" },
                    { href: "/network",       label: "Find Researchers"     },
                    { href: "/academy",       label: "Browse Courses"       },
                    { href: "/insights",      label: "Read Insights"        },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:text-[#111827]"
                      style={{ borderColor: "#E2E8F0", color: "#4B5563" }}>
                      {label} →
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs mb-8" style={{ color: "#4B5563" }}>
                  {total} result{total !== 1 ? "s" : ""} for &ldquo;<span style={{ color: "#111827" }}>{q}</span>&rdquo;
                </p>

                <div className="space-y-12">
                  {ORDER.filter((type) => grouped[type].length > 0).map((type) => {
                    const hits = grouped[type];
                    const meta = TYPE_META[type];
                    const Icon = meta.Icon;
                    return (
                      <section key={type}>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: meta.color }} />
                            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#111827" }}>
                              {meta.label}
                            </h2>
                          </div>
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: `${meta.color}18`, color: meta.color }}>
                            {hits.length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {hits.map((hit) => (
                            <Link
                              key={hit.id}
                              href={hit.href}
                              className="group flex items-start gap-4 rounded-xl border p-4 transition-all hover:border-[#CBD5E1]"
                              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  {hit.badge && (
                                    <span className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                                      style={{
                                        backgroundColor: `${hit.badgeColor}18`,
                                        color:           hit.badgeColor ?? "#9CA3AF",
                                      }}>
                                      {hit.badge}
                                    </span>
                                  )}
                                  {hit.meta && (
                                    <span className="text-[11px]" style={{ color: "#4B5563" }}>{hit.meta}</span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold leading-snug mb-1 group-hover:text-[#111827] transition-colors"
                                  style={{ color: "#111827" }}>
                                  {hit.title}
                                </p>
                                {hit.excerpt && (
                                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#4B5563" }}>
                                    {hit.excerpt}
                                  </p>
                                )}
                              </div>
                              <ArrowRight
                                className="h-4 w-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: "#4B5563" }}
                              />
                            </Link>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Initial state — no query yet */}
        {q.length < 2 && (
          <div className="space-y-3">
            <p className="text-xs mb-6" style={{ color: "#4B5563" }}>
              {q.length === 0 ? "Start typing to search across all content." : "Enter at least 2 characters."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ORDER.map((type) => {
                const meta = TYPE_META[type];
                const Icon = meta.Icon;
                const hrefs: Record<string, string> = {
                  event:       "/events",
                  opportunity: "/opportunities",
                  researcher:  "/network",
                  course:      "/academy",
                  insight:     "/insights",
                };
                return (
                  <Link key={type} href={hrefs[type]}
                    className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-[#CBD5E1]"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
                    <Icon className="h-5 w-5" style={{ color: meta.color }} />
                    <span className="text-xs font-semibold" style={{ color: "#4B5563" }}>{meta.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
