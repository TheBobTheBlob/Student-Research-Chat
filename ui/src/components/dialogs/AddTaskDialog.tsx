import { useState } from "react"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewTaskForm } from "@/components/forms/NewTaskForm"

export function AddTaskDialog() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const { chatUUID } = useParams({ strict: false })
    const queryClient = useQueryClient()

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Plus onClick={() => setDialogOpen(true)} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>Create a new task for this chat.</DialogDescription>
                </DialogHeader>
                {chatUUID && (
                    <NewTaskForm
                        chat_uuid={chatUUID}
                        onTaskCreated={() => {
                            queryClient.invalidateQueries({ queryKey: ["tasks", chatUUID] })
                            setDialogOpen(false)
                        }}
                        onClose={() => setDialogOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
