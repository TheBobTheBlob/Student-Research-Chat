import type { TaskRow } from "@/components/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskDetails } from "@/components/forms/TaskDetails"

interface TaskDialogProps {
    task: TaskRow | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    canEdit?: boolean
}

export function TaskDialog({ task, open, onOpenChange, onClose, canEdit = false }: TaskDialogProps) {
    if (!task) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                    {canEdit ? <DialogDescription>View and edit task details.</DialogDescription> : null}
                </DialogHeader>
                <TaskDetails task={task} onClose={onClose} canEdit={canEdit} />
            </DialogContent>
        </Dialog>
    )
}
