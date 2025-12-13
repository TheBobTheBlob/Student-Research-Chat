import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useFetch } from "@/hooks/use-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { DialogFooter } from "@/components/ui/dialog"

interface CreateMeetingFormProps {
    onClose: () => void
    chatUUID?: string
}

export function CreateMeetingForm({ onClose, chatUUID }: CreateMeetingFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const queryClient = useQueryClient()

    const createMeeting = useMutation({
        mutationFn: async (data: any) => {
            return useFetch({
                url: "/meetings/new",
                data,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] })
            toast.success("Meeting created successfully")
            onClose()
        },
        onError: () => {
            toast.error("Failed to create meeting")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !startTime || !endTime) {
            toast.error("Please fill in all required fields")
            return
        }

        createMeeting.mutate({
            title,
            description,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            chat_uuid: chatUUID,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting Title" required />
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Meeting Description"
                            rows={3}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel>Start Time</FieldLabel>
                            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                        </Field>
                        <Field>
                            <FieldLabel>End Time</FieldLabel>
                            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={createMeeting.isPending}>
                    {createMeeting.isPending ? "Creating..." : "Create Meeting"}
                </Button>
            </DialogFooter>
        </form>
    )
}
