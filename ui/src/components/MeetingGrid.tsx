import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar, CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import type { MeetingRow } from "@/components/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { cn } from "@/lib/utils"

interface MeetingGridProps {
    meetings: Array<MeetingRow>
}

export function MeetingGrid({ meetings }: MeetingGridProps) {
    const queryClient = useQueryClient()

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

    if (meetings.length === 0) {
        return <div className="text-center text-muted-foreground py-12">No meetings scheduled.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting) => (
                <Card key={meeting.meeting_uuid} className="h-full flex flex-col py-3">
                    <CardHeader className="pb-1 px-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div
                                className={cn(
                                    "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                                    meeting.user_response === "attending"
                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                        : meeting.user_response === "not_attending"
                                          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                                          : meeting.user_response === "maybe"
                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                                            : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
                                )}
                            >
                                {meeting.user_response.replace("_", " ")}
                            </div>
                        </div>
                        <CardTitle className="mt-2 text-lg">{meeting.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(meeting.start_time).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3 px-3">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3 flex-1">{meeting.description}</p>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t">
                            <Button
                                variant={meeting.user_response === "attending" ? "default" : "ghost"}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "attending" })}
                                title="Attending"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={meeting.user_response === "maybe" ? "secondary" : "ghost"}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "maybe" })}
                                title="Maybe"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={meeting.user_response === "not_attending" ? "destructive" : "ghost"}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => respondToMeeting.mutate({ meeting_uuid: meeting.meeting_uuid, status: "not_attending" })}
                                title="Not Attending"
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
