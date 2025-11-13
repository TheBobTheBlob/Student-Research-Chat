import { useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { indexRoute } from "@/routes/routes"

export function useLogout(): () => Promise<void> {
    const queryClient = useQueryClient()

    const logoutFunction = async () => {
        await useFetch({ url: "/users/logout", data: {} })
        queryClient.clear()
        window.location.replace(indexRoute.to)
    }
    return logoutFunction
}
