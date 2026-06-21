/* eslint-disable @typescript-eslint/no-require-imports */
const fs   = require("fs");
const path = require("path");

// Curated Unsplash images — topically matched to each article
const IMAGES = {
  "academic-digital-identity":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=420&q=80&auto=format&fit=crop",
  "ai-and-research-discovery":
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=420&q=80&auto=format&fit=crop",
  "altmetrics-and-research-impact":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=420&q=80&auto=format&fit=crop",
  "bibliometrics-and-citation-intelligence":
    "https://images.unsplash.com/photo-1532094349884-32b439649027?w=800&h=420&q=80&auto=format&fit=crop",
  "citation-network-analysis":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=420&q=80&auto=format&fit=crop",
  "collaborative-research-networks":
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=420&q=80&auto=format&fit=crop",
  "departmental-bibliometrics":
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=420&q=80&auto=format&fit=crop",
  "dois-and-scholarly-attribution":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=420&q=80&auto=format&fit=crop",
  "early-career-researcher-visibility":
    "https://images.unsplash.com/photo-1434030216411-0b5816e4b9f4?w=800&h=420&q=80&auto=format&fit=crop",
  "google-scholar-profile-optimisation":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=420&q=80&auto=format&fit=crop",
  "how-to-grow-your-h-index":
    "https://images.unsplash.com/photo-1504868654005-ebef7c5b3bef?w=800&h=420&q=80&auto=format&fit=crop",
  "institutional-research-visibility-strategy":
    "https://images.unsplash.com/photo-1522202176988-66273c0fd55e?w=800&h=420&q=80&auto=format&fit=crop",
  "knowledge-translation-for-researchers":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=420&q=80&auto=format&fit=crop",
  "open-access-and-research-discoverability":
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=420&q=80&auto=format&fit=crop",
  "open-science-infrastructure":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=420&q=80&auto=format&fit=crop",
  "orcid-and-scholarly-identity":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=420&q=80&auto=format&fit=crop",
  "policy-briefs-for-researchers":
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=420&q=80&auto=format&fit=crop",
  "preprint-servers-and-knowledge-dissemination":
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=420&q=80&auto=format&fit=crop",
  "research-data-management-and-visibility":
    "https://images.unsplash.com/photo-1532094349884-32b439649027?w=800&h=420&q=80&auto=format&fit=crop",
  "research-excellence-frameworks":
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=420&q=80&auto=format&fit=crop",
  "scopus-author-profile-optimisation":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=420&q=80&auto=format&fit=crop",
  "social-media-for-researchers":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=420&q=80&auto=format&fit=crop",
  "understanding-research-visibility":
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=420&q=80&auto=format&fit=crop",
  "writing-lay-summaries":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=420&q=80&auto=format&fit=crop",
  "writing-visual-abstracts":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=420&q=80&auto=format&fit=crop",
};

const dir = path.join(process.cwd(), "content", "insights");
let updated = 0;

for (const [slug, url] of Object.entries(IMAGES)) {
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  MISSING: ${slug}.mdx`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.includes("featured_image: null")) {
    console.log(`  SKIP (already set): ${slug}`);
    continue;
  }
  const patched = content.replace("featured_image: null", `featured_image: "${url}"`);
  fs.writeFileSync(filePath, patched, "utf-8");
  console.log(`  ✓ ${slug}`);
  updated++;
}

console.log(`\nDone — ${updated} files updated.`);
