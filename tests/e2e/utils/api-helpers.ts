import { APIRequestContext, expect } from "@playwright/test";

export async function createTestUser(request: APIRequestContext) {
    const timestamp = Date.now();
    const email = `test_user_${timestamp}@example.com`;
    const password = "password123";
    const firstName = "Test";
    const lastName = "User";

    const registerResponse = await request.post("http://localhost:8000/users/register", {
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            user_type: "student",
        },
    });
    expect(registerResponse.ok()).toBeTruthy();

    await expect
        .poll(
            async () => {
                const loginResponse = await request.post("http://localhost:8000/users/login", {
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
