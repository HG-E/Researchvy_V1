import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("Researchvy logo is visible and links to homepage", async ({ page }) => {
    const logo = page.getByRole("link", { name: /researchvy/i }).first();
    await expect(logo).toBeVisible();
    const href = await logo.getAttribute("href");
    expect(href).toBe("/");
  });

  test("nav link: Events navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: "Events" }).first().click();
    await expect(page).toHaveURL(/\/events/);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("nav link: Opportunities navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: "Opportunities" }).first().click();
    await expect(page).toHaveURL(/\/opportunities/);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("nav link: Insights navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: "Insights" }).first().click();
    await expect(page).toHaveURL(/\/insights/);
    // Any h1 on the insights page
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("nav link: About navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("'Check My Score' nav CTA links to scorecard", async ({ page }) => {
    const cta = page.getByRole("link", { name: /check my score/i }).first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toContain("visibility-scorecard");
  });

  test("Sign In link is present", async ({ page }) => {
    const signIn = page.getByRole("link", { name: /sign in/i }).first();
    await expect(signIn).toBeVisible();
    const href = await signIn.getAttribute("href");
    expect(href).toMatch(/signin|login/i);
  });

  test("mobile: hamburger menu opens", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only test");
    const menuBtn = page.getByRole("button", { name: /menu|open/i }).first();
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.getByRole("link", { name: "Events" })).toBeVisible();
  });

  test("Clinics dropdown / link leads to clinics page", async ({ page }) => {
    const clinicsLink = page.getByRole("link", { name: /clinics/i }).first();
    await clinicsLink.click();
    await expect(page).toHaveURL(/\/clinics/);
  });
});
