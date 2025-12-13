import { test, expect } from "@playwright/test";
import { createTestUser } from "./utils/api-helpers";

test("Register as Student", async ({ page }) => {
    const timestamp = Date.now();
    const email = `student_${timestamp}@example.com`;

    await page.goto("/register");
    await expect(page).toHaveTitle(/Register - StudentChat/);

    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");

    await page.getByLabel("Type").click();
    await page.getByRole("option", { name: "Student" }).click();

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/.*\/login/);
});

test("Register as Professor", async ({ page }) => {
    const timestamp = Date.now();
    const email = `prof_${timestamp}@example.com`;

    await page.goto("/register");
    await expect(page).toHaveTitle(/Register - StudentChat/);

    await page.getByLabel("First Name").fill("Jane");
    await page.getByLabel("Last Name").fill("Smith");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");

    await page.getByLabel("Type").click();
    await page.getByRole("option", { name: "Professor" }).click();

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/.*\/login/);
});

test("Login", async ({ page, request }) => {
    const { email, password } = await createTestUser(request);

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/.*\/app/);
    await expect(page.getByRole("heading", { name: "Recent Chats" })).toBeVisible();
});
