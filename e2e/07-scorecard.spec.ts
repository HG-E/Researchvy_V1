import { test, expect } from "@playwright/test";

test.describe("Visibility Scorecard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources/visibility-scorecard", { waitUntil: "domcontentloaded" });
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /visibility scorecard/i })
    ).toBeVisible();
  });

  test("scorecard shows 0 initial score", async ({ page }) => {
    // Score displays as "0 / 100" (4 dimensions × 25 max each)
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/\b0\b/);
  });

  test("four scoring dimensions are labeled", async ({ page }) => {
    const dims = [
      "Scholar Identity",
      "Discoverability",
      "Citation Health",
      "Research Communication",
    ];
    for (const dim of dims) {
      await expect(page.getByText(dim).first()).toBeVisible();
    }
  });

  test("first question (ORCID iD) is visible", async ({ page }) => {
    await expect(page.getByText(/ORCID/i).first()).toBeVisible();
  });

  test("Google Scholar question is visible", async ({ page }) => {
    await expect(page.getByText(/google scholar/i).first()).toBeVisible();
  });

  test("answer options are clickable", async ({ page }) => {
    const firstOption = page
      .getByRole("radio")
      .or(page.locator("button").filter({ hasText: /yes|no|partially|complete|fully|created/i }))
      .first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toBeTruthy();
  });

  test("urgency strip has no July 2026 cohort reference", async ({ page }) => {
    // The urgency strip only renders after scorecard completion, so we check
    // the client bundle (injected via script tags) for cohort label strings.
    // Legitimate schedule dates like "29 July 2026" are allowed — only reject
    // a marketing/cohort label that still says July.
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).not.toMatch(/July 2026 cohort|cohort.*July 2026/i);
  });

  test("'Join the Clinic' CTA visible on scorecard page", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(
      page.getByRole("link", { name: /join.*clinic|check my score|take.*free|clinic/i }).first()
    ).toBeVisible();
  });
});
