import { test, expect } from "@playwright/test";

test.describe("Auth Flows", () => {
  test("sign-in page loads with email + password fields", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "domcontentloaded" });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("sign-in page has link to create account", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "domcontentloaded" });
    // The sign-in form has a "Create one free" link to /signup
    const signUpLink = page.getByRole("link", { name: /sign up|create account|register|create one free/i });
    await expect(signUpLink).toBeVisible();
  });

  test("sign-up page loads with required fields", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Use .first() — sign-up has 2 password fields (password + confirm)
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("invalid sign-in shows error (not blank page)", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "domcontentloaded" });
    await page.fill('input[type="email"]', "notareal@email.test");
    await page.fill('input[type="password"]', "wrongpassword123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForTimeout(3000);
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toMatch(/invalid|incorrect|wrong|error|not found/i);
  });

  test("dashboard redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/signin|login/i);
  });

  test("admin redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/signin|login/i);
  });
});
