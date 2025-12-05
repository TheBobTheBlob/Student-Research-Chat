import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { TaskDetails } from "./forms/TaskDetails"
import { useFetch } from "@/hooks/use-fetch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const userQuery = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => {
            const response = await useFetch({ url: "/users/authenticate", data: {} })
            return response
        },
    })

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
            {tasks.map((task: Task) => (
                <div
                    key={task.task_uuid}
                    className="group flex flex-col gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors bg-card text-card-foreground shadow-sm cursor-pointer"
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

            {selectedTask && (
                <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Task Details</DialogTitle>
                            <DialogDescription>View and edit task details.</DialogDescription>
                        </DialogHeader>
                        <TaskDetails
                            task={selectedTask}
                            onClose={() => setSelectedTask(null)}
                            canEdit={userQuery.data?.user_uuid === selectedTask.creator_uuid}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
