import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"

export function TaskForm({ chat_uuid, onTaskCreated }: { chat_uuid: string, onTaskCreated: () => void }) {
    const [title, setTitle] = useState("")
    const queryClient = useQueryClient()

    const createTask = useMutation({
        mutationFn: async () => {
            return await useFetch({
                url: "/tasks/new",
                data: {
                    chat_uuid,
                    title,
                },
            })
        },
        onSuccess: () => {
            setTitle("")
            queryClient.invalidateQueries({ queryKey: ["tasks", chat_uuid] })
            onTaskCreated()
        },
    })

    return (
        <div className="mb-4">
            <input
                className="border p-2 w-full rounded"
                placeholder="New task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Button
                className="mt-2"
                onClick={() => title.trim() && createTask.mutate()}
            >
                Add Task
            </Button>
        </div>
    )
}
