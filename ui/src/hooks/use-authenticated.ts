import { useFetch } from "./use-fetch"

export interface AuthenticatedResponse {
    email: string
    first_name: string
    last_name: string
    user_type: "student" | "professor"
    user_uuid: string
}

export async function useAuthenticated(): Promise<AuthenticatedResponse> {
    const response = await useFetch({ url: "/users/authenticate", data: {} })
    return response
}
