import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AnnouncementFormProps {
    chat_uuid: string
    onTaskCreated: () => void
    onClose: () => void
}

export function AnnouncementForm({ chat_uuid, onTaskCreated, onClose }: AnnouncementFormProps) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const queryClient = useQueryClient()

    const createAnnouncement = useMutation({
        mutationFn: async () => {
            return await useFetch({
                url: "/announcements/new",
                data: { chat_uuid, title, content },
            })
        },
        onSuccess: () => {
            setTitle("")
            setContent("")
            queryClient.invalidateQueries({ queryKey: ["announcements", chat_uuid] })
            onTaskCreated()
        },
    })

    return (
        <div className="space-y-4">
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Field>

                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea value={content || ""} onChange={(e) => setContent(e.target.value)} rows={4} />
                    </Field>
                </FieldGroup>
            </FieldSet>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={() => title.trim() && createAnnouncement.mutate()}>Publish Announcement</Button>
            </DialogFooter>
        </div>
    )
}
