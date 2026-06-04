/**
 * Configurable RSS feed sources for the Research Opportunities Board.
 *
 * AFRICA-RELEVANCE FILTER:
 * Only items matching RELEVANCE_KEYWORDS are imported — so global feeds
 * only surface opportunities that are open to African/international researchers.
 *
 * HOW TO ADD A NEW SOURCE:
 * 1. Find the RSS feed URL (look for the RSS icon or /rss /feed /atom on the site)
 * 2. Add an entry below
 * 3. Run the cron manually once to test: GET /api/cron/fetch-opportunities
 *
 * SOURCES WITHOUT RSS (manual entry in admin panel):
 * - TWAS (twas.org) — no RSS feed
 * - Wellcome Trust (wellcome.org) — uses 360Giving CSV export, not RSS
 * - NRF South Africa (nrf.ac.za) — no RSS
 * - African Academy of Sciences (aasciences.africa) — no RSS
 * For these, add opportunities manually at /admin/opportunities
 */

export interface FeedSource {
  name:        string;
  url:         string;
  category:    "grant" | "fellowship" | "conference" | "speaking" | "collaboration" | "job" | "award" | "other";
  targetLevel: "all" | "early_career" | "mid" | "senior";
}

/**
 * Keywords that make an item relevant to Researchvy's audience.
 * An item must contain AT LEAST ONE of these to be imported.
 */
export const RELEVANCE_KEYWORDS = [
  // Audience-specific
  "africa", "african", "nigeria", "ghana", "kenya", "ethiopia", "sub-saharan",
  "developing countr", "lmic", "low-income countr", "low- and middle-income",
  "global south", "international applicant", "open to international",
  // Career stage
  "early career", "early-career", "phd", "postdoc", "post-doctoral",
  "young researcher", "emerging researcher", "junior researcher",
  // Opportunity types
  "fellowship", "scholarship", "grant", "funding opportunit", "call for proposal",
  "call for application", "award", "prize", "research grant",
];

/**
 * Keywords that indicate an item is NOT relevant (skip it).
 */
export const SKIP_KEYWORDS = [
  "us citizens only", "us citizen only", "american citizens only",
  "restricted to us", "eligible only: us", "open to us applicants only",
];

export const FEED_SOURCES: FeedSource[] = [
  {
    name:        "NIH Funding Opportunities",
    url:         "https://grants.nih.gov/grants/guide/newsfeed/fundingopps.xml",
    category:    "grant",
    targetLevel: "all",
  },
  {
    name:        "Nature Jobs — Science",
    url:         "https://feeds.nature.com/naturejobs/rss/sciencejobs",
    category:    "job",
    targetLevel: "all",
  },
  {
    name:        "NSF Funding Opportunities",
    url:         "https://www.nsf.gov/rss/rss_www_funding.xml",
    category:    "grant",
    targetLevel: "all",
  },
  {
    name:        "EU Research & Innovation",
    url:         "https://research-and-innovation.ec.europa.eu/news/rss_en",
    category:    "grant",
    targetLevel: "all",
  },
];
