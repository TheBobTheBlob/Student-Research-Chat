import type { AnnouncementRow } from "@/components/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AnnouncementDetails } from "@/components/forms/AnnouncementDetails"

interface AnnouncementDialogProps {
    announcement: AnnouncementRow | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

export function AnnouncementDialog({ announcement, open, onOpenChange, onClose }: AnnouncementDialogProps) {
    if (!announcement) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Announcement Details</DialogTitle>
                </DialogHeader>
                <AnnouncementDetails announcement={announcement} onClose={onClose} />
            </DialogContent>
        </Dialog>
    )
}
