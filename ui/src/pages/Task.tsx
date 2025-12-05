import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { TaskGrid } from "@/components/TaskGrid"

export default function TasksPage() {
    const tasksQuery = useQuery({
        queryKey: ["user_tasks"],
        queryFn: async () => {
            const response = await useFetch({ url: "/tasks/all", data: {} })
            return response.tasks ?? []
        },
    })

    if (tasksQuery.isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
    }

    if (tasksQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading tasks.</div>
    }

    const tasks = tasksQuery.data ?? []

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
            <TaskGrid tasks={tasks} />
        </div>
    )
}
