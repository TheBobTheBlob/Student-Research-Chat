import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import type { MeetingRow } from "@/components/types"
import { useFetch } from "@/hooks/use-fetch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MeetingListProps {
    chatUUID?: string
    filterStatus?: Array<string>
}

export function MeetingList({ chatUUID, filterStatus = ["attending", "pending"] }: MeetingListProps) {
    const queryClient = useQueryClient()

    const meetingsQuery = useQuery({
        queryKey: ["meetings"],
        queryFn: async () => {
            const response = await useFetch({ url: "/meetings/list", data: {} })
            return response.meetings ?? []
        },
    })

    const respondToMeeting = useMutation({
        mutationFn: async ({ meeting_uuid, status }: { meeting_uuid: string; status: string }) => {
            return useFetch({
                url: "/meetings/respond",
                data: { meeting_uuid, status },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] })
            toast.success("Response updated")
        },
        onError: () => {
            toast.error("Failed to update response")
        },
    })

    if (meetingsQuery.isLoading) return <div className="px-2 text-sm text-muted-foreground">Loading meetings...</div>
    if (meetingsQuery.isError) return <div className="px-2 text-sm text-destructive">Error loading meetings.</div>

    let meetings = meetingsQuery.data ?? []

    if (chatUUID) {
        meetings = meetings.filter((m: MeetingRow) => m.chat_uuid === chatUUID)
    }
    meetings = meetings.filter((m: MeetingRow) => filterStatus.includes(m.user_response))

    if (meetings.length === 0) {
        return <div className="px-2 text-sm text-muted-foreground">No upcoming meetings.</div>
    }

    return (
        <div className="flex flex-col gap-2 px-2">
            {meetings.map((meeting: MeetingRow) => (
                <div
                    key={meeting.meeting_uuid}
                    className="group flex flex-col gap-1 rounded-lg border py-2 px-2.5 hover:bg-muted/50 transition-colors bg-card text-card-foreground shadow-sm"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm leading-tight pt-0.5">{meeting.title}</div>
                        <div
                            className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-medium border capitalize shrink-0",
                                meeting.user_response === "attending"
                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
                            )}
                        >
                            {meeting.user_response}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(meeting.start_time).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1">
                        <Button
                            variant={meeting.user_response === "attending" ? "default" : "ghost"}
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "attending" })}
                            title="Attending"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={meeting.user_response === "maybe" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "maybe" })}
                            title="Maybe"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={meeting.user_response === "not_attending" ? "destructive" : "ghost"}
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "not_attending" })}
                            title="Not Attending"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
