import { test, expect } from "@playwright/test";

test("Website loads", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await expect(page).toHaveTitle(/Chat/);
});
