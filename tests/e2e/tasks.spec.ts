import { test, expect } from "./fixtures";
import { createChat, createTask, createTestUser } from "./utils/api-helpers";

test.beforeEach(async ({ page }) => {
    await createTestUser(page.request);
});

test("Task visible on home", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Task Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const taskTitle = `API Task ${timestamp}`;
    await createTask(page.request, chatUuid, taskTitle);

    await page.goto("/app/home");

    await expect(page.locator("main").getByText(taskTitle)).toBeVisible();
});

test("Task visible on tasks page", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Task Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const taskTitle = `API Task ${timestamp}`;
    await createTask(page.request, chatUuid, taskTitle);

    await page.goto("/app/tasks");

    await expect(page.locator("main").getByText(taskTitle)).toBeVisible();
});

test("Task visible on sidebar", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Task Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const taskTitle = `API Task ${timestamp}`;
    await createTask(page.request, chatUuid, taskTitle);

    await page.goto(`/app/chat/${chatUuid}`);

    await expect(page.locator("aside").getByText(taskTitle)).toBeVisible();
});

test("Create task via UI", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Task Chat ${timestamp}`;
    const chatUuid = await createChat(page.request, chatName);
    const uiTaskTitle = `UI Task ${timestamp}`;

    await page.goto(`/app/chat/${chatUuid}`);

    await page.getByTitle("Add Task").click();
    await page.getByPlaceholder("New task title...").fill(uiTaskTitle);
    await page.getByRole("button", { name: "Add Task" }).click();

    await expect(page.locator("aside").getByText(uiTaskTitle)).toBeVisible();
});
