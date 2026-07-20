import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Researchvy/i);
  });

  test("hero headline is visible", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toMatch(/great research/i);
  });

  test("hero rotating word cycles (seen / cited / found)", async ({ page }) => {
    const rotatingWords = ["seen.", "cited.", "found.", "read.", "heard."];
    const h1Text = await page.locator("h1").textContent();
    const hasWord = rotatingWords.some((w) => h1Text?.toLowerCase().includes(w));
    expect(hasWord).toBe(true);
  });

  test("'Join the Clinic' CTA is visible and links to WhatsApp or clinics", async ({ page }) => {
    // Two "Join the Clinic" links can exist (hero + elsewhere) — use first()
    const btn = page.getByRole("link", { name: /join the clinic/i }).first();
    await expect(btn).toBeVisible();
    const href = await btn.getAttribute("href");
    // WhatsApp short URL is wa.me — also accept /clinics path
    expect(href).toMatch(/wa\.me|whatsapp|clinics/i);
  });

  test("'Take the FREE Scorecard' CTA links to scorecard", async ({ page }) => {
    const btn = page.getByRole("link", { name: /take the free scorecard/i });
    await expect(btn).toBeVisible();
    const href = await btn.getAttribute("href");
    expect(href).toContain("visibility-scorecard");
  });

  test("hero stat pills show 4 numbers", async ({ page }) => {
    // Wait for Framer Motion animations to complete
    await page.waitForTimeout(1500);
    for (const stat of ["87%", "2.4×", "140+", "10K+"]) {
      await expect(page.getByText(stat).first()).toBeVisible();
    }
  });

  test("trust micro-copy is present", async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.getByText(/38\+ countries/i).first()).toBeVisible();
    await expect(page.getByText(/certified on completion/i).first()).toBeVisible();
  });

  test("image on right column loads (no broken img)", async ({ page }) => {
    const heroImg = page.locator("section img").first();
    await expect(heroImg).toBeVisible();
    const naturalWidth = await heroImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("'Three steps to research that gets found' section renders", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    await expect(page.getByText(/three steps to research that gets found/i)).toBeVisible();
  });

  test("Step 01 Visibility Scorecard card visible", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(800);
    await expect(page.getByText("Visibility Scorecard").first()).toBeVisible();
  });

  test("Step 02 Digital Visibility Clinic card visible", async ({ page }) => {
    const card = page.getByText("Digital Visibility Clinic").first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(card).toBeVisible();
    const price = page.getByText(/from \$79/i).first();
    await price.scrollIntoViewIfNeeded();
    await expect(price).toBeVisible();
  });

  test("Step 03 Private Consulting card visible", async ({ page }) => {
    const card = page.getByText("Private Consulting").first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(card).toBeVisible();
    const price = page.getByText(/from \$209/i).first();
    await price.scrollIntoViewIfNeeded();
    await expect(price).toBeVisible();
  });

  test("impact narrative section renders journey steps", async ({ page }) => {
    await expect(page.getByText(/your research is meant to/i)).toBeVisible();
    await expect(page.getByText(/research happens/i)).toBeVisible();
  });

  test("testimonials section has at least one name", async ({ page }) => {
    const name = page.getByText(/Dr\. A\. Mensah/i).first();
    await name.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(name).toBeVisible();
  });

  test("footer has contact email", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/info@researchvy\.com/i).first()).toBeVisible();
  });

  test("footer copyright year is 2026", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText(/© 2026 Researchvy/i)).toBeVisible();
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    const realErrors = errors.filter(
      (e) => !e.includes("Extension") && !e.includes("favicon") && !e.includes("404")
    );
    expect(realErrors).toHaveLength(0);
  });
});
