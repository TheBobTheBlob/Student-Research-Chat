import { test, expect } from "./fixtures";
import { createChat, createTestUser } from "./utils/api-helpers";

test.beforeEach(async ({ page }) => {
    await createTestUser(page.request);
});

test("Chat visible on home", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Test Chat ${timestamp}`;

    await createChat(page.request, chatName);

    await page.goto("/app/home");

    await expect(page.locator("main").getByText(chatName)).toBeVisible();
});

test("Chat visible on chats page", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Test Chat ${timestamp}`;

    await createChat(page.request, chatName);

    await page.goto("/app/chats");

    await expect(page.locator("main").getByText(chatName)).toBeVisible();
});

test("Chat visible on sidebar", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Test Chat ${timestamp}`;

    await createChat(page.request, chatName);

    await page.goto("/app/chats");

    await expect(page.locator("aside").getByText(chatName)).toBeVisible();
});

test("Create chat", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `UI Test Chat ${timestamp}`;
    await page.goto("/app/chats");

    await page.getByRole("button", { name: "Add Chat" }).click();

    await page.getByLabel("Name").fill(chatName);
    await page.getByRole("button", { name: "Create Chat" }).click();

    await expect(page.locator("main").getByText(chatName)).toBeVisible();
    await expect(page.locator("aside").getByText(chatName)).toBeVisible();
});

test("Delete chat", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Chat to Delete ${timestamp}`;
    const chatUUID = await createChat(page.request, chatName);

    await page.goto(`/app/chat/${chatUUID}`);

    await page.getByTestId("chat-header-menu-button").click();
    await page.getByRole("menuitem", { name: "Delete Chat" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.locator("main").getByText(chatName)).not.toBeVisible();
    await expect(page.locator("aside").getByText(chatName)).not.toBeVisible();
});

test("Send message", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Chat for Messaging ${timestamp}`;
    const chatUUID = await createChat(page.request, chatName);
    const messageContent = `Hello, this is a test message sent at ${timestamp}`;

    await page.goto(`/app/chat/${chatUUID}`);
    await page.getByPlaceholder("Type a message...").fill(messageContent);
    await page.getByTestId("send-message-button").click();
    await expect(page.getByText(messageContent)).toBeVisible();

    const messages = page.locator(".chat-message--text");
    await expect(messages.last()).toHaveText(messageContent);
});

test("Add member to chat", async ({ page }) => {
    const timestamp = Date.now();
    const chatName = `Chat for Adding Member ${timestamp}`;
    const chatUUID = await createChat(page.request, chatName);
    const { email, firstName, lastName } = await createTestUser(page.request);

    await page.goto(`/app/chat/${chatUUID}`);
    await page.getByRole("button", { name: "Add User" }).click();

    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Add User" }).click();

    await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
});
