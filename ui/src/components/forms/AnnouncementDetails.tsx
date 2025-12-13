import { CheckCircle2, Circle } from "lucide-react"
import type { AnnouncementRow } from "@/components/types"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useAnnouncementStatus } from "@/hooks/use-announcement-status"

interface TaskDetailsProps {
    announcement: AnnouncementRow
    onClose: () => void
}

export function AnnouncementDetails({ announcement, onClose }: TaskDetailsProps) {
    const { markRead, markUnread } = useAnnouncementStatus()
    const isUnread = announcement.status === "unread"

    const toggleStatus = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (isUnread) {
            await markRead.mutateAsync(announcement.announcement_uuid)
        } else {
            await markUnread.mutateAsync(announcement.announcement_uuid)
        }
        onClose()
    }

    return (
        <form className="space-y-4">
            <FieldSet disabled={true}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={announcement.title} />
                    </Field>

                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Textarea value={announcement.content || ""} rows={4} />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <DialogFooter className="gap-2">
                <Button
                    variant={isUnread ? "default" : "secondary"}
                    type="button"
                    onClick={toggleStatus}
                    disabled={markRead.isPending || markUnread.isPending}
                >
                    {isUnread ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Read
                        </>
                    ) : (
                        <>
                            <Circle className="mr-2 h-4 w-4" />
                            Mark as Unread
                        </>
                    )}
                </Button>
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
            </DialogFooter>
        </form>
    )
}
