import { test, expect } from "@playwright/test";

test.describe("Performance & Load Times", () => {
  const pages = [
    { name: "Homepage",      path: "/" },
    { name: "Clinics",       path: "/clinics" },
    { name: "Events",        path: "/events" },
    { name: "Opportunities", path: "/opportunities" },
    { name: "Insights",      path: "/insights" },
    { name: "About",         path: "/about" },
    { name: "Scorecard",     path: "/resources/visibility-scorecard" },
  ];

  for (const { name, path } of pages) {
    test(`${name} — loads in under 15s (domcontentloaded)`, async ({ page }) => {
      const start = Date.now();
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const elapsed = Date.now() - start;
      console.log(`  ${name}: ${elapsed}ms`);
      // 15s budget accounts for Vercel cold-start on SSR pages
      expect(elapsed, `${name} took ${elapsed}ms — over 15s budget`).toBeLessThan(15_000);
    });
  }

  test("Homepage — no 4xx/5xx network responses", async ({ page }) => {
    const failures: string[] = [];
    page.on("response", (resp) => {
      if (resp.status() >= 400 && !resp.url().includes("favicon")) {
        failures.push(`${resp.status()} ${resp.url()}`);
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(failures, `Failed requests:\n${failures.join("\n")}`).toHaveLength(0);
  });

  test("Clinics — no 4xx/5xx network responses", async ({ page }) => {
    const failures: string[] = [];
    page.on("response", (resp) => {
      if (resp.status() >= 400 && !resp.url().includes("favicon")) {
        failures.push(`${resp.status()} ${resp.url()}`);
      }
    });
    await page.goto("/clinics", { waitUntil: "networkidle" });
    expect(failures, `Failed requests:\n${failures.join("\n")}`).toHaveLength(0);
  });
});
