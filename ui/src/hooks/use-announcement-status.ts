import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { toast } from "sonner"

export function useAnnouncementStatus() {
    const queryClient = useQueryClient()

    const markRead = useMutation({
        mutationFn: async (announcementUUID: string) => {
            return useFetch({
                url: "/announcements/mark-read",
                data: { announcement_uuid: announcementUUID },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] })
            toast.success("Marked as read")
        },
        onError: () => {
            toast.error("Failed to update status")
        },
    })

    const markUnread = useMutation({
        mutationFn: async (announcementUUID: string) => {
            return useFetch({
                url: "/announcements/mark-unread",
                data: { announcement_uuid: announcementUUID },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] })
            toast.success("Marked as unread")
        },
        onError: () => {
            toast.error("Failed to update status")
        },
    })

    return { markRead, markUnread }
}
