/**
 * Weekly cron: fetches RSS feeds from research funding sources,
 * filters for Africa-relevance, and creates draft opportunities
 * for admin review at /admin/opportunities.
 *
 * Nothing is auto-published. Every item lands as is_published=false
 * so an admin reads, edits, and approves it before researchers see it.
 *
 * Schedule: every Sunday at 6am (vercel.json)
 * Trigger manually: GET /api/cron/fetch-opportunities
 *   with Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { isCronAuthorized } from "@/lib/auth/cronAuth";
import { FEED_SOURCES, RELEVANCE_KEYWORDS, SKIP_KEYWORDS } from "@/lib/feeds/sources";
import type { FeedSource } from "@/lib/feeds/sources";

// ── RSS parser (zero external dependency fallback using fetch + regex) ──────────
// We use rss-parser if available; if import fails we fall back to basic parsing.

interface FeedItem {
  title?:       string;
  link?:        string;
  contentSnippet?: string;
  content?:     string;
  isoDate?:     string;
  pubDate?:     string;
}

function isSafeFeedUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (!["http:", "https:"].includes(protocol)) return false;
    // Block internal/metadata IPs (SSRF protection)
    const blocked = ["localhost","127.0.0.1","::1","0.0.0.0","169.254.169.254","metadata.google.internal"];
    if (blocked.some((b) => hostname === b)) return false;
    // Block private IPv4 ranges (RFC 1918 + link-local)
    if (
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("169.254.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) return false;
    return true;
  } catch { return false; }
}

async function parseFeed(url: string): Promise<FeedItem[]> {
  if (!isSafeFeedUrl(url)) {
    console.error("[fetch-opportunities] Blocked unsafe URL:", url);
    return [];
  }
  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({ timeout: 10_000 });
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []) as FeedItem[];
  } catch {
    return [];
  }
}

// ── Africa-relevance scoring ─────────────────────────────────────────────────

function isRelevant(item: FeedItem): boolean {
  const text = [item.title, item.contentSnippet, item.content]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Skip if explicitly US-only
  if (SKIP_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))) return false;

  // Must contain at least one relevance keyword
  return RELEVANCE_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// ── Deadline extraction ──────────────────────────────────────────────────────

function extractDeadline(text: string): string | null {
  // Look for "deadline: Month DD, YYYY" or "due: YYYY-MM-DD" patterns
  const patterns = [
    /deadline[:\s]+(\w+ \d{1,2},?\s+\d{4})/i,
    /due[:\s]+(\d{4}-\d{2}-\d{2})/i,
    /closes?[:\s]+(\w+ \d{1,2},?\s+\d{4})/i,
    /by (\w+ \d{1,2},?\s+\d{4})/i,
    /(\d{4}-\d{2}-\d{2})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const d = new Date(match[1]);
        if (!isNaN(d.getTime()) && d > new Date()) {
          return d.toISOString().split("T")[0];
        }
      } catch { /* skip */ }
    }
  }
  return null;
}

// ── Main cron handler ────────────────────────────────────────────────────────

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin   = createSupabaseAdminClient();
  const results = { fetched: 0, relevant: 0, saved: 0, skipped_duplicate: 0, errors: 0 };

  for (const source of FEED_SOURCES) {
    try {
      await processSource(source, admin, results);
    } catch (err) {
      console.error(`[fetch-opportunities] error for ${source.name}:`, err);
      results.errors++;
      // Record error in sources table
      await admin
        .from("opportunity_sources")
        .update({ last_error: String(err) })
        .eq("url", source.url)
        .then(() => {}, () => {});
    }
  }

  console.log("[fetch-opportunities]", results);
  return NextResponse.json({ ok: true, ...results });
}

async function processSource(
  source: FeedSource,
  admin:  ReturnType<typeof createSupabaseAdminClient>,
  results: Record<string, number>,
) {
  const items = await parseFeed(source.url);
  results.fetched += items.length;

  // Get source DB record for foreign key
  const { data: sourceRow } = await admin
    .from("opportunity_sources")
    .select("id")
    .eq("url", source.url)
    .maybeSingle();

  const relevant = items.filter(isRelevant);
  results.relevant += relevant.length;

  for (const item of relevant) {
    if (!item.title || !item.link) continue;

    // Deduplicate by source URL
    const { data: existing } = await admin
      .from("research_opportunities")
      .select("id")
      .eq("source_url", item.link)
      .maybeSingle();

    if (existing) { results.skipped_duplicate++; continue; }

    const body    = (item.contentSnippet ?? item.content ?? "").slice(0, 1500);
    const deadline = extractDeadline(body + " " + (item.title ?? ""));

    const { error } = await admin.from("research_opportunities").insert({
      title:        item.title.slice(0, 250),
      body:         body || "See full details at the source link.",
      category:     source.category,
      target_level: source.targetLevel,
      apply_url:    item.link,
      deadline,
      is_published: false,   // ← admin review required before going live
      is_featured:  false,
      auto_fetched: true,
      source_id:    sourceRow?.id ?? null,
      source_url:   item.link,
    });

    if (!error) results.saved++;
    else console.error("[fetch-opportunities] insert error:", error.message);
  }

  // Update last_fetched_at
  await admin
    .from("opportunity_sources")
    .update({ last_fetched_at: new Date().toISOString(), last_item_count: relevant.length, last_error: null })
    .eq("url", source.url);
}
