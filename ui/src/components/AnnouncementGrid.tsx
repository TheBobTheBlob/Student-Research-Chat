import { useState } from "react"
import { CheckCircle2, Circle, Megaphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAnnouncementStatus } from "@/hooks/use-announcement-status"
import { AnnouncementDialog } from "@/components/AnnouncementDialog"
import { cn } from "@/lib/utils"
import type { AnnouncementRow } from "@/components/types"

interface AnnouncementGridProps {
    announcements: Array<AnnouncementRow>
}

export function AnnouncementGrid({ announcements }: AnnouncementGridProps) {
    const { markRead, markUnread } = useAnnouncementStatus()
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementRow | null>(null)

    if (announcements.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No announcements.</div>
    }

    const toggleStatus = async (e: React.MouseEvent, announcement: AnnouncementRow) => {
        e.stopPropagation()
        if (announcement.status === "unread") {
            await markRead.mutateAsync(announcement.announcement_uuid)
        } else {
            await markUnread.mutateAsync(announcement.announcement_uuid)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((announcement) => (
                    <Card
                        key={announcement.announcement_uuid}
                        className={cn(
                            "h-full transition-all duration-200 hover:shadow-md relative group cursor-pointer",
                            announcement.status === "unread" ? "border-blue-500/50 bg-blue-50/30 dark:bg-blue-950/10" : "hover:bg-muted/50",
                        )}
                        onClick={() => setSelectedAnnouncement(announcement)}
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
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
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                            <div
                                className={cn(
                                    "p-2 rounded-full mt-1",
                                    announcement.status === "unread"
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <CardTitle className="text-lg font-semibold leading-tight">{announcement.title}</CardTitle>
                                <CardDescription className="mt-1 text-xs">
                                    {new Date(announcement.created_at).toLocaleDateString()}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AnnouncementDialog
                announcement={selectedAnnouncement}
                open={!!selectedAnnouncement}
                onOpenChange={(open) => !open && setSelectedAnnouncement(null)}
                onClose={() => setSelectedAnnouncement(null)}
            />
        </>
    )
}
