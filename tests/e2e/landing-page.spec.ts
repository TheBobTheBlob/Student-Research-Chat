import { test, expect } from "@playwright/test";

test("Website loads", async ({ page }) => {
    await page.goto("");
    await expect(page).toHaveTitle(/Chat/);
});

test("Navigate to Login page - Header", async ({ page }) => {
    await page.goto("");
    await page.click('text="Log in"');
    await expect(page).toHaveTitle(/Login - StudentChat/);

    const locator = page.locator('button:has-text("Login")');
    await expect(locator).toBeVisible();
});

test("Navigate to Login page - Hero", async ({ page }) => {
    await page.goto("");
    await page.click('text="Existing User?"');
    await expect(page).toHaveTitle(/Login - StudentChat/);

    const locator = page.locator('button:has-text("Login")');
    await expect(locator).toBeVisible();
});

test("Navigate to Register page - Header", async ({ page }) => {
    await page.goto("");
    await page.click('text="Get Started"');
    await expect(page).toHaveTitle(/Register - StudentChat/);

    const locator = page.locator('button:has-text("Create account")');
    await expect(locator).toBeVisible();
});

test("Navigate to Register page - Hero", async ({ page }) => {
    await page.goto("");
    await page.click('text="Start Collaborating"');
    await expect(page).toHaveTitle(/Register - StudentChat/);

    const locator = page.locator('button:has-text("Create account")');
    await expect(locator).toBeVisible();
});

test("GitHub link", async ({ page }) => {
    await page.goto("");
    const [newPage] = await Promise.all([page.waitForEvent("popup"), page.getByRole("link", { name: "GitHub" }).click()]);
    await expect(newPage).toHaveURL("https://github.com/TheBobTheBlob/Student-Research-Chat");
});
