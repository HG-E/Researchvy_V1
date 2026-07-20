import { test, expect } from "@playwright/test";

test.describe("Opportunities Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/opportunities", { waitUntil: "domcontentloaded" });
  });

  test("page loads with correct heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toMatch(/grants|fellowships|opportunities|calls/i);
  });

  test("category filter pills render", async ({ page }) => {
    for (const label of ["All", "Grants", "Fellowships", "Travel Grants"]) {
      await expect(page.getByRole("link", { name: label }).first()).toBeVisible();
    }
  });

  test("search input is present", async ({ page }) => {
    await expect(page.locator('input[name="q"]')).toBeVisible();
  });

  test("empty state shows coming-soon block, not bare stub", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/coming soon|being curated|submit.*opportunity/i);
    expect(bodyText).not.toContain("check back soon");
  });

  test("empty state has 'Submit an Opportunity — Free' button", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /submit an opportunity/i }).first()
    ).toBeVisible();
  });

  test("scorecard strip visible on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/visibility score|maximise|scorecard/i);
  });

  test("'Submit an Opportunity' header button links to /opportunities/submit", async ({ page }) => {
    const link = page.getByRole("link", { name: /submit an opportunity/i }).first();
    const href = await link.getAttribute("href");
    expect(href).toContain("/opportunities/submit");
  });

  test("newsletter strip at bottom is visible", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/get new grants|calls delivered weekly/i).first()).toBeVisible();
  });

  test("filtering by Grants updates URL", async ({ page }) => {
    await page.getByRole("link", { name: /^grants$/i }).click();
    await expect(page).toHaveURL(/category=grant/);
  });
});
