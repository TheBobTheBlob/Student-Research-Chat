import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { CheckCircle2, Circle } from "lucide-react"
import type { AnnouncementRow } from "@/components/types"
import { useFetch } from "@/hooks/use-fetch"
import { AnnouncementDialog } from "@/components/AnnouncementDialog"
import { useAnnouncementStatus } from "@/hooks/use-announcement-status"
import { Button } from "@/components/ui/button"

interface AnnouncementListProps {
    chatUUID?: string
    onlyUnread?: boolean
}

export function AnnouncementList({ chatUUID, onlyUnread }: AnnouncementListProps) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementRow | null>(null)
    const { markRead, markUnread } = useAnnouncementStatus()

    const announcementQuery = useQuery({
        queryKey: ["announcements", chatUUID ?? "all-user"],
        queryFn: async () => {
            const response = await useFetch({ url: "/announcements/list", data: { chat_uuid: chatUUID } })
            return response?.announcements ?? []
        },
    })

    if (announcementQuery.isLoading) return <div>Loading announcements...</div>
    if (announcementQuery.isError) return <div>Error loading announcements.</div>

    const announcements = announcementQuery.data ?? []

    if (announcements.filter((announcement: AnnouncementRow) => (onlyUnread ? announcement.status === "unread" : true)).length === 0)
        return <div className="text-sm text-muted-foreground px-2">No announcements yet.</div>

    const toggleStatus = async (e: React.MouseEvent, announcement: AnnouncementRow) => {
        e.stopPropagation()
        if (announcement.status === "unread") {
            await markRead.mutateAsync(announcement.announcement_uuid)
        } else {
            await markUnread.mutateAsync(announcement.announcement_uuid)
        }
    }

    return (
        <div className="flex flex-col gap-2 px-2">
            {announcements
                .filter((announcement: AnnouncementRow) => (onlyUnread ? announcement.status === "unread" : true))
                .map((announcement: AnnouncementRow) => (
                    <div
                        key={announcement.announcement_uuid}
                        className={
                            "group flex flex-col gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors bg-card text-card-foreground shadow-sm cursor-pointer"
                        }
                        onClick={() => setSelectedAnnouncement(announcement)}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm leading-tight pt-0.5">{announcement.title}</div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={(e) => toggleStatus(e, announcement)}
                                title={announcement.status === "unread" ? "Mark as read" : "Mark as unread"}
                            >
                                {announcement.status === "unread" ? (
                                    <Circle className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>
                ))}

            <AnnouncementDialog
                announcement={selectedAnnouncement}
                open={!!selectedAnnouncement}
                onOpenChange={(open) => !open && setSelectedAnnouncement(null)}
                onClose={() => setSelectedAnnouncement(null)}
            />
        </div>
    )
}
