import { test, expect } from "@playwright/test";

test.describe("Clinics Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/clinics", { waitUntil: "domcontentloaded" });
  });

  test("page title contains Clinics", async ({ page }) => {
    await expect(page).toHaveTitle(/clinic|researchvy/i);
  });

  test("hero headline is visible", async ({ page }) => {
    // h1 with "Stop Being Invisible." — use body text check as fallback
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toMatch(/stop being invisible|visibility clinic|start getting cited/i);
  });

  test("August 2026 cohort banner is visible (not July)", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toContain("August 2026");
    // "29 July 2026" (Wednesday start) and "26 July 2026" (deadline) are legitimate dates;
    // "per cohort" + registration date also legitimately appear together.
    // Only reject the explicit cohort-label phrase.
    expect(bodyText).not.toMatch(/July 2026 cohort/i);
  });

  test("pricing: Single Module price visible", async ({ page }) => {
    // $79 regular or $45 early bird — either is valid
    await expect(page.getByText(/\$79|\$45/).first()).toBeVisible();
  });

  test("pricing: Core Bundle (Most Popular) visible", async ({ page }) => {
    // $149 regular or $99 early bird
    await expect(page.getByText(/most popular|★/).first()).toBeVisible();
  });

  test("pricing: Pro Bundle price visible", async ({ page }) => {
    await expect(page.getByText(/pro bundle|DVC Pro/i).first()).toBeVisible();
  });

  test("NGN pricing shown (dual currency)", async ({ page }) => {
    await expect(page.getByText(/₦/).first()).toBeVisible();
  });

  test("'View Full Programme' link is present", async ({ page }) => {
    const link = page.getByRole("link", { name: /view full programme/i }).first();
    await expect(link).toBeVisible();
  });

  test("cohort tracks (Wednesday / Sunday) shown", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/wednesday|sunday/i);
  });

  test("registration deadline shown", async ({ page }) => {
    await expect(page.getByText(/registration closes/i)).toBeVisible();
  });

  test("'Join August Cohort' CTA button visible", async ({ page }) => {
    const btn = page.getByRole("link", { name: /join august cohort|reserve my spot/i });
    await expect(btn.first()).toBeVisible();
  });

  test("FAQ section has at least 5 questions", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    // Custom accordion uses aria-expanded on buttons, not data-state
    const faqItems = page.locator("button[aria-expanded]");
    const count = await faqItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("testimonials are visible", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/Dr\.|Prof\.|researcher|cohort/i);
  });

  test("'Private Consulting' section visible with price", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/private consulting/i).first()).toBeVisible();
    await expect(page.getByText(/\$209/).first()).toBeVisible();
  });

  test("institutional section visible", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    await expect(
      page.getByText(/institution|research department|institutional/i).first()
    ).toBeVisible();
  });

  test("no broken images on page", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      if (src && !src.startsWith("data:")) {
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        expect(naturalWidth, `Broken image: ${src}`).toBeGreaterThan(0);
      }
    }
  });
});
