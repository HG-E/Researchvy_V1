import { test, expect } from "@playwright/test";

test.describe("Insights Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/insights", { waitUntil: "domcontentloaded" });
  });

  test("page loads with correct heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toMatch(/research intelligence|visibility|insights/i);
  });

  test("article count meta is present (25+ articles)", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/25\+|article|insight/i);
  });

  test("at least 3 article cards or links are visible", async ({ page }) => {
    const cards = page.locator("article, [data-testid='article-card'], a[href*='/insights/']");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("'Understanding Research Visibility' article is present", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/understanding research visibility|research visibility/i);
  });

  test("'Google Scholar' content is present", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/google scholar/i);
  });

  test("category filter or tag is visible", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/scholarly visibility|visibility|research/i);
  });

  test("clicking an article navigates to its page", async ({ page }) => {
    const firstArticle = page
      .locator("a[href*='/insights/']")
      .filter({ hasNotText: /^insights$/i })
      .first();
    await expect(firstArticle).toBeVisible();
    await firstArticle.click();
    await expect(page).toHaveURL(/\/insights\/.+/);
  });

  test("scorecard CTA strip is visible on insights page", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(
      page.getByRole("link", { name: /scorecard|take the free|check my score/i }).first()
    ).toBeVisible();
  });
});
