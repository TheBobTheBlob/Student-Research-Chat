import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface NewTaskFormProps {
    chat_uuid: string
    onTaskCreated: () => void
    onClose: () => void
}

export function NewTaskForm({ chat_uuid, onTaskCreated, onClose }: NewTaskFormProps) {
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
        <div className="space-y-4">
            <Input placeholder="New task title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={() => title.trim() && createTask.mutate()}>Add Task</Button>
            </DialogFooter>
        </div>
    )
}
