import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { AnnouncementGrid } from "@/components/AnnouncementGrid"

export default function Announcements() {
    const announcementsQuery = useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            const response = await useFetch({ url: "/announcements/list", data: {} })
            return response.announcements ?? []
        },
    })

    if (announcementsQuery.isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading announcements...</div>
    }

    if (announcementsQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading announcements.</div>
    }

    const announcements = announcementsQuery.data ?? []
    const unreadAnnouncements = announcements.filter((a: any) => a.status === "unread")
    const readAnnouncements = announcements.filter((a: any) => a.status === "read")

    return (
        <div className="p-6 max-w-7xl mx-auto w-full space-y-12">
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {unreadAnnouncements.length ? <span className="w-3 h-3 rounded-full bg-blue-500" /> : null}
                    Unread Announcements
                    {unreadAnnouncements.length ? (
                        <span className="text-2xl font-normal text-muted-foreground ml-2">({unreadAnnouncements.length})</span>
                    ) : null}
                </h2>
                <AnnouncementGrid announcements={unreadAnnouncements} />
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Read Announcements</h2>
                <AnnouncementGrid announcements={readAnnouncements} />
            </section>
        </div>
    )
}
