import { test, expect } from "@playwright/test";

test.describe("Events Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/events", { waitUntil: "domcontentloaded" });
  });

  test("page loads with correct heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toMatch(/academic events/i);
  });

  test("'Submit an Event' CTA is visible", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /submit (an |your )?event/i }).first()
    ).toBeVisible();
  });

  test("'Submit an Event' links to /events/submit", async ({ page }) => {
    const link = page.getByRole("link", { name: /submit (an |your )?event/i }).first();
    const href = await link.getAttribute("href");
    expect(href).toContain("/events/submit");
  });

  test("search input is present", async ({ page }) => {
    await expect(page.locator('input[name="q"]')).toBeVisible();
  });

  test("type filter pills are rendered", async ({ page }) => {
    await expect(page.getByRole("link", { name: /conference/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /workshop/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /webinar/i }).first()).toBeVisible();
  });

  test("empty state shows coming-soon block (not bare 'No events')", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/coming soon|being curated|submit your event/i);
    expect(bodyText).not.toContain("No events yet");
  });

  test("empty state has 'Submit Your Event — Free' button", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /submit your event/i }).first()
    ).toBeVisible();
  });

  test("empty state has newsletter signup CTA", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /notified|subscribe free|newsletter/i }).first()
    ).toBeVisible();
  });

  test("newsletter strip at bottom is visible", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/get new events|calls for papers weekly/i).first()).toBeVisible();
  });

  test("filter by Conference type — URL updates", async ({ page }) => {
    await page.getByRole("link", { name: /^conference$/i }).first().click();
    await expect(page).toHaveURL(/type=conference/);
  });

  test("'Organising an Academic Event?' section visible", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/organising an academic event/i)).toBeVisible();
  });
});
