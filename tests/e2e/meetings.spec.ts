import { test, expect } from "./fixtures";
import { createChat, createMeeting, createTestUser } from "./utils/api-helpers";

test.beforeEach(async ({ page }) => {
    await createTestUser(page.request, "professor");
});

test("Meeting visible on home", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Meeting Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const meetingTitle = `API Meeting ${timestamp}`;
    const startTime = new Date(timestamp + 86400000).toISOString(); // Tomorrow
    const endTime = new Date(timestamp + 90000000).toISOString(); // Tomorrow + 1 hour
    await createMeeting(page.request, chatUuid, meetingTitle, "Description", startTime, endTime);

    await page.goto("/app/home");

    await expect(page.locator("main").getByText(meetingTitle)).toBeVisible();
});

test("Meeting visible on meetings page", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Meeting Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const meetingTitle = `API Meeting ${timestamp}`;
    const startTime = new Date(timestamp + 86400000).toISOString(); // Tomorrow
    const endTime = new Date(timestamp + 90000000).toISOString(); // Tomorrow + 1 hour
    await createMeeting(page.request, chatUuid, meetingTitle, "Description", startTime, endTime);

    await page.goto("/app/meetings");

    await expect(page.locator("main").getByText(meetingTitle)).toBeVisible();
});

test("Meeting visible on sidebar", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Meeting Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const meetingTitle = `API Meeting ${timestamp}`;
    const startTime = new Date(timestamp + 86400000).toISOString(); // Tomorrow
    const endTime = new Date(timestamp + 90000000).toISOString(); // Tomorrow + 1 hour
    await createMeeting(page.request, chatUuid, meetingTitle, "Description", startTime, endTime);

    await page.goto(`/app/chat/${chatUuid}`);

    await expect(page.locator("aside").getByText(meetingTitle)).toBeVisible();
});

test("Create meeting via UI", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Meeting Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const title = `UI Meeting ${timestamp}`;

    await page.goto(`/app/chat/${chatUuid}`);

    await page.getByTitle("Add Meeting").click();
    await page.getByRole("textbox", { name: "Meeting Title" }).fill(title);
    await page.getByRole("textbox", { name: "Meeting Description" }).fill("Created via UI");

    const tomorrow = new Date(timestamp + 86400000);
    const tomorrowPlusOne = new Date(timestamp + 90000000);

    const formatDateTime = (date: Date) => {
        return date.toISOString().slice(0, 16);
    };

    await page.getByRole("textbox").nth(2).fill(formatDateTime(tomorrow));
    await page.getByRole("textbox").nth(3).fill(formatDateTime(tomorrowPlusOne));

    await page.getByRole("button", { name: "Create Meeting" }).click();
    await expect(page.locator("aside").getByText(title)).toBeVisible();
});
