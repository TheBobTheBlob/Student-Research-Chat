import { useState } from "react"
import { useParams } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateMeetingForm } from "@/components/forms/CreateMeetingForm"

export function AddMeetingDialog() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const { chatUUID } = useParams({ strict: false })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Plus onClick={() => setDialogOpen(true)} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                </DialogHeader>
                <CreateMeetingForm onClose={() => setDialogOpen(false)} chatUUID={chatUUID} />
            </DialogContent>
        </Dialog>
    )
}
