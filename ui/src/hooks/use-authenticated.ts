import { useFetch } from "./use-fetch"

export async function useAuthenticated() {
    const response = await useFetch({ url: "/users/authenticate", data: {} })
    return response
}
