import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
  });

  test("page loads with hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /built for researchers/i })
    ).toBeVisible();
  });

  test("framework section renders 7 steps", async ({ page }) => {
    const framework = ["Research", "Visibility", "Discoverability", "Connection", "Communication", "Application", "Impact"];
    const bodyText = await page.locator("body").textContent();
    for (const step of framework) {
      expect(bodyText).toContain(step);
    }
  });

  test("Hillary Goodness facilitator profile is present", async ({ page }) => {
    // Use .first() to avoid strict mode violation (name appears in heading + body text)
    await expect(page.getByText(/hillary goodness/i).first()).toBeVisible();
  });

  test("values section (Scholarly Integrity etc.) visible", async ({ page }) => {
    await expect(page.getByText(/scholarly integrity/i)).toBeVisible();
  });

  test("no excessive duplicate ecosystem sections", async ({ page }) => {
    const intelligenceCount = await page.getByText(/Researchvy Intelligence/i).count();
    expect(intelligenceCount).toBeLessThanOrEqual(3);
  });

  test("'Take Free Scorecard' CTA present", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /scorecard|check my score/i }).first()
    ).toBeVisible();
  });
});
