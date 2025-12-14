import { test, expect } from "./fixtures";
import { createChat, createAnnouncement, createTestUser } from "./utils/api-helpers";

test.beforeEach(async ({ page }) => {
    await createTestUser(page.request, "professor");
});

test("Announcement visible on home", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Announcement Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const announcementTitle = `API Announcement ${timestamp}`;
    await createAnnouncement(page.request, chatUuid, announcementTitle, "Content from API");

    await page.goto("/app/home");

    await expect(page.locator("main").getByText(announcementTitle)).toBeVisible();
});

test("Announcement visible on announcements page", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Announcement Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const announcementTitle = `API Announcement ${timestamp}`;
    await createAnnouncement(page.request, chatUuid, announcementTitle, "Content from API");

    await page.goto("/app/announcements");

    await expect(page.locator("main").getByText(announcementTitle)).toBeVisible();
});

test("Announcement visible on sidebar", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Announcement Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const announcementTitle = `API Announcement ${timestamp}`;
    await createAnnouncement(page.request, chatUuid, announcementTitle, "Content from API");

    await page.goto(`/app/chat/${chatUuid}`);

    await expect(page.locator("aside").getByText(announcementTitle)).toBeVisible();
});

test("Create announcement via UI", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Announcement Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const uiTitle = `UI Announcement ${timestamp}`;

    await page.goto(`/app/chat/${chatUuid}`);

    await page.getByTitle("Add Announcement").click();
    await page.getByRole("textbox").nth(0).fill(uiTitle);
    await page.getByRole("textbox").nth(1).fill("Created via UI");
    await page.getByRole("button", { name: "Publish Announcement" }).click();

    await expect(page.locator("aside").getByText(uiTitle)).toBeVisible();
});
