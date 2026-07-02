import { test, expect } from "@playwright/test";

test.describe("critical flows", () => {
  test("register, login, track training/match, logout, protected redirect", async ({
    page,
  }) => {
    const email = `e2e+${Date.now()}@example.com`;
    const password = "supersecret123";

    await page.goto("/register");
    await page.fill("#name", "E2E Test");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');
    await expect(page.locator("div.font-mono")).toBeVisible();
    await page.click('button:has-text("Code kopieren")');
    await page.click('a:has-text("Weiter zum Login")');
    await page.waitForURL("**/login");

    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
    await expect(page.locator("body")).toContainText("Willkommen zurück");

    await page.goto("/training/new");
    await page.fill("#date", new Date().toISOString().slice(0, 10));
    await page.fill("#durationMin", "45");
    await page.click('button[type="submit"]:has-text("Speichern")');
    await page.waitForURL("**/training");
    await expect(page.locator("body")).toContainText("Technik-Drill");

    await page.goto("/matches/new");
    await page.fill("#date", new Date().toISOString().slice(0, 10));
    await page.fill("#opponentName", "E2E Gegner");
    await page.fill("#score", "6-2, 6-4");
    await page.click('button[type="submit"]:has-text("Speichern")');
    await page.waitForURL("**/matches");
    await expect(page.locator("body")).toContainText("E2E Gegner");

    await page.goto("/dashboard");
    await expect(page.locator("body")).toContainText("1 - 0");

    await page.click('button:has-text("Abmelden")');
    await page.waitForURL("**/login");

    await page.goto("/dashboard");
    await page.waitForURL("**/login*");
  });

  test("wrong credentials show an error", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "nonexistent@example.com");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("body")).toContainText("falsch");
  });

  test("drill library is browsable and filterable", async ({ page }) => {
    const email = `e2edrills+${Date.now()}@example.com`;
    const password = "supersecret123";

    await page.goto("/register");
    await page.fill("#name", "Drill Tester");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');
    await page.click('button:has-text("Code kopieren")');
    await page.click('a:has-text("Weiter zum Login")');
    await page.waitForURL("**/login");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    await page.goto("/drills");
    await expect(page.locator("body")).toContainText("Drill-Bibliothek");

    await page.click('a:has-text("Vorhand")');
    await expect(page.locator("body")).toContainText("Inside-Out Vorhand");
    await expect(page.locator("body")).not.toContainText("Kick-Aufschlag");
  });
});
