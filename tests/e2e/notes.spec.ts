import { test, expect } from "./fixtures";
import { createNote, createTestUser } from "./utils/api-helpers";

test.beforeEach(async ({ page }) => {
    await createTestUser(page.request);
});

test("Note visible on home", async ({ page }) => {
    const timestamp = Date.now();
    const noteName = `API Note ${timestamp}`;
    await createNote(page.request, noteName, "Content from API");

    await page.goto("/app/home");

    await expect(page.locator("main").getByText(noteName)).toBeVisible();
});

test("Note visible on notes page", async ({ page }) => {
    const timestamp = Date.now();
    const noteName = `API Note ${timestamp}`;
    await createNote(page.request, noteName, "Content from API");

    await page.goto("/app/notes");

    await expect(page.locator("main").getByText(noteName)).toBeVisible();
});

test("Create note via UI", async ({ page }) => {
    const timestamp = Date.now();
    const uiNoteName = `UI Note ${timestamp}`;

    await page.goto("/app/notes");

    await page.getByRole("button", { name: "Add Note" }).click();
    await page.getByLabel("Title").fill(uiNoteName);
    await page.getByLabel("Content").fill("Created via UI");
    await page.getByRole("button", { name: "Add Note" }).click();

    await expect(page.locator("main").getByText(uiNoteName)).toBeVisible();
});
