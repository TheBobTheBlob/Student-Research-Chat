import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { ChatGrid } from "@/components/ChatGrid"
import { TaskGrid } from "@/components/TaskGrid"
import { NoteGrid } from "@/components/NoteGrid"
import { AnnouncementList } from "@/components/AnnouncementList"

export default function Homepage() {
    const chats = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await useFetch({ url: "/chats/list", data: {} })
            return response
        },
    })

    const tasksQuery = useQuery({
        queryKey: ["user_tasks"],
        queryFn: async () => {
            const response = await useFetch({ url: "/tasks/all", data: {} })
            return response.tasks ?? []
        },
    })

    const notesQuery = useQuery({
        queryKey: ["user_notes"],
        queryFn: async () => {
            const response = await useFetch({ url: "/notes/list", data: {} })
            return response.notes ?? []
        },
    })

    if (chats.isPending || tasksQuery.isPending || notesQuery.isPending) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
    }

    if (chats.isError || tasksQuery.isError || notesQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading dashboard.</div>
    }

    return (
        <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6">Recent Chats</h2>
                    <ChatGrid chats={chats.data.slice(0, 6)} />
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
                    <TaskGrid tasks={tasksQuery.data.slice(0, 6)} />
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">My Notes</h2>
                    <NoteGrid notes={notesQuery.data.slice(0, 6)} />
                </section>
            </div>

            <div className="lg:col-span-1">
                <section className="sticky top-6">
                    <h2 className="text-2xl font-bold mb-6">Announcements</h2>
                    <AnnouncementList onlyUnread />
                </section>
            </div>
        </div>
    )
}
