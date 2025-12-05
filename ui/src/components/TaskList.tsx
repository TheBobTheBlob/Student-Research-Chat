import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { EditTask } from "./forms/EditTask"
import { useFetch } from "@/hooks/use-fetch"

interface Task {
    task_uuid: string
    chat_uuid?: string
    creator_uuid: string
    assignee_uuid?: string
    title: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
    created_at?: string
}

interface TaskListProps {
    chat_uuid?: string
}

export function TaskList({ chat_uuid: chatUUID }: TaskListProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null)

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

    if (tasks.length === 0) return <div className="text-sm text-muted-foreground">No tasks yet.</div>

    return (
        <div className="flex flex-col gap-2">
            {tasks.map((task: Task) => (
                <div key={task.task_uuid} className="p-3 border rounded bg-muted/20">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.status ?? "pending"}</div>

                    {/* {task.creator_uuid === currentUserUuid && ( */}
                    <button className="mt-2 text-sm text-blue-500" onClick={() => setEditingTask(task)}>
                        Edit
                    </button>
                    {/* )} */}
                </div>
            ))}

            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <EditTask task={editingTask} onClose={() => setEditingTask(null)} />
                    </div>
                </div>
            )}
        </div>
    )
}
