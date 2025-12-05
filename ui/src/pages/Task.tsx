import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"

export default function TasksPage() {
    const tasksQuery = useQuery({
        queryKey: ["user_tasks"],
        queryFn: async () => {
            const res = await useFetch({
                url: "/tasks/all",
                data: {}, // nothing needed
            })
            return res.tasks ?? []
        },
    })

    if (tasksQuery.isLoading) {
        return <div>Loading tasks...</div>
    }

    const tasks = tasksQuery.data ?? []

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">My Tasks</h1>

            {tasks.length === 0 ? (
                <div className="text-sm text-muted-foreground">No tasks found.</div>
            ) : (
                <div className="flex flex-col gap-2">
                    {tasks.map((task: any) => (
                        <div key={task.task_uuid} className="p-3 border rounded bg-muted/20">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground">{task.status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
