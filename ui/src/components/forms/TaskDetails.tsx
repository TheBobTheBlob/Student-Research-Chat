import { toast } from "sonner"
import { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TaskRow } from "@/components/types"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { useFetch } from "@/hooks/use-fetch"

interface TaskDetailsProps {
    task: TaskRow
    onClose: () => void
    canEdit?: boolean
    defaultEditing?: boolean
}

export function TaskDetails({ task, onClose, canEdit = false, defaultEditing = false }: TaskDetailsProps) {
    const [isEditing, setIsEditing] = useState(defaultEditing)
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [dueDate, setDueDate] = useState(task.due_date || "")
    const [priority, setPriority] = useState(task.priority || "")
    const [status, setStatus] = useState(task.status || "")
    const assignee = useMemo(() => task.assignee_uuid || "", [task.assignee_uuid])
    const queryClient = useQueryClient()

    const updateTask = useMutation({
        mutationFn: async (taskData: any) => {
            const response = await useFetch({
                url: "/tasks/update",
                data: taskData,
            })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: () => {
            toast.error("Failed to update task.")
        },
    })

    const deleteTask = useMutation({
        mutationFn: async () => {
            const response = await useFetch({
                url: "/tasks/delete",
                data: { task_uuid: task.task_uuid },
            })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            toast.success("Task deleted.")
            onClose()
        },
        onError: () => {
            toast.error("Failed to delete task.")
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateTask.mutateAsync({
            task_uuid: task.task_uuid,
            title,
            description,
            due_date: dueDate,
            priority,
            status,
            assignee,
        })
        setIsEditing(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet disabled={!isEditing}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Field>

                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea value={description || ""} onChange={(e) => setDescription(e.target.value)} rows={4} />
                    </Field>

                    <Field>
                        <FieldLabel>Due Date</FieldLabel>
                        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </Field>

                    <Field>
                        <FieldLabel>Priority</FieldLabel>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="to_do">To Do</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <DialogFooter>
                {canEdit &&  (
                    <div className="w-full flex justify-between items-center">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault()
                                deleteTask.mutate()
                            }}
                            disabled={deleteTask.isPending}
                        >
                            {deleteTask.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                )}
                {isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                if (defaultEditing) {
                                    onClose()
                                } else {
                                    setIsEditing(false)
                                    setTitle(task.title)
                                    setDescription(task.description)
                                    setDueDate(task.due_date || "")
                                    setPriority(task.priority || "")
                                    setStatus(task.status || "")
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateTask.isPending}>
                            {updateTask.isPending ? "Updating..." : "Update"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                onClose()
                            }}
                        >
                            Close
                        </Button>
                        {canEdit && (
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsEditing(true)
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </>
                )}
            </DialogFooter>
        </form>
    )
}
