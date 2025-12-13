import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { MeetingGrid } from "@/components/MeetingGrid"

export default function Meetings() {
    const meetingsQuery = useQuery({
        queryKey: ["meetings"],
        queryFn: async () => {
            const response = await useFetch({ url: "/meetings/list", data: {} })
            return response.meetings ?? []
        },
    })

    if (meetingsQuery.isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading meetings...</div>
    }

    if (meetingsQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading meetings.</div>
    }

    return (
        <div className="p-6 max-w-7xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Meetings</h1>
            </div>

            <MeetingGrid meetings={meetingsQuery.data} />
        </div>
    )
}
