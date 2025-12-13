import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { TaskRow } from "@/components/types"
import { TaskDialog } from "@/components/dialogs/TaskDialog"
import { useFetch } from "@/hooks/use-fetch"
import { appRoute } from "@/routes/routes"

interface TaskListProps {
    chatUUID?: string
}

export function TaskList({ chatUUID }: TaskListProps) {
    const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null)
    const { currentUser } = appRoute.useRouteContext()

    const tasksQuery = useQuery({
        queryKey: ["tasks", chatUUID ?? "all-user"],
        queryFn: async () => {
            const url = chatUUID ? `/tasks/list?chat_uuid=${chatUUID}` : "/tasks/all"
            const response = await useFetch({
                url,
                data: {},
            })
            return response?.tasks ?? []
        },
    })

    if (tasksQuery.isLoading) return <div>Loading tasks...</div>
    if (tasksQuery.isError) return <div>Error loading tasks.</div>

    const tasks = tasksQuery.data ?? []

    if (tasks.length === 0) return <div className="text-sm text-muted-foreground px-2">No tasks yet.</div>

    return (
        <div className="flex flex-col gap-2 px-2">
            {tasks.map((task: TaskRow) => (
                <div
                    key={task.task_uuid}
                    className="group flex flex-col gap-1 rounded-lg border py-2 px-2.5 hover:bg-muted/50 transition-colors bg-card text-card-foreground shadow-sm cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm leading-tight pt-0.5">{task.title}</div>
                    </div>
                    <div>
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10 uppercase tracking-wider">
                            {task.status?.replace("_", " ") ?? "pending"}
                        </span>
                    </div>
                </div>
            ))}

            <TaskDialog
                task={selectedTask}
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTask(null)}
                onClose={() => setSelectedTask(null)}
                canEdit={currentUser.user_uuid === selectedTask?.creator_uuid}
            />
        </div>
    )
}
