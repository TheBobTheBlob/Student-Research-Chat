import { APIRequestContext, expect } from "@playwright/test";

const URL = "http://localhost:8000";

export async function createTestUser(request: APIRequestContext, userType: "student" | "professor" = "student") {
    const timestamp = Date.now();
    const email = `test_user_${timestamp}@example.com`;
    const password = "password123";
    const firstName = "User";
    const lastName = timestamp.toString();

    const registerResponse = await request.post(`${URL}/users/register`, {
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            user_type: userType,
        },
    });
    expect(registerResponse.ok()).toBeTruthy();

    await expect
        .poll(
            async () => {
                const loginResponse = await request.post(`${URL}/users/login`, {
                    data: { email, password },
                });
                return loginResponse.status();
            },
            {
                message: "User creation timed out - DB might be slow",
                timeout: 10000,
                intervals: [500],
            }
        )
        .toBe(200);

    return { email, password, firstName, lastName };
}

export async function createChat(request: APIRequestContext, name: string) {
    const response = await request.post(`${URL}/chats/new`, {
        data: { name },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.chat_uuid;
}

export async function createTask(request: APIRequestContext, chatUuid: string, title: string, description: string = "") {
    const response = await request.post(`${URL}/tasks/new`, {
        data: {
            chat_uuid: chatUuid,
            title,
            description,
            priority: "medium",
        },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.task_uuid;
}

export async function createAnnouncement(request: APIRequestContext, chatUuid: string, title: string, content: string) {
    const response = await request.post(`${URL}/announcements/new`, {
        data: {
            chat_uuid: chatUuid,
            title,
            content,
        },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.announcement_uuid;
}

export async function createNote(request: APIRequestContext, name: string, content: string) {
    const response = await request.post(`${URL}/notes/new`, {
        data: {
            name,
            content,
        },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.note_uuid;
}

export async function createMeeting(
    request: APIRequestContext,
    chatUuid: string,
    title: string,
    description: string,
    startTime: string,
    endTime: string
) {
    const response = await request.post(`${URL}/meetings/new`, {
        data: {
            chat_uuid: chatUuid,
            title,
            description,
            start_time: startTime,
            end_time: endTime,
        },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.meeting_uuid;
}
