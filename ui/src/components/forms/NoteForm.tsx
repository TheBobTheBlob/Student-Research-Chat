import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface NoteFormProps {
    onNoteCreated: () => void
    onClose: () => void
}

export function NoteForm({ onNoteCreated, onClose }: NoteFormProps) {
    const [name, setName] = useState("")
    const [content, setContent] = useState("")
    const queryClient = useQueryClient()

    const createNote = useMutation({
        mutationFn: async () => {
            return await useFetch({ url: "/notes/new", data: { name: name, content: content } })
        },
        onSuccess: () => {
            setName("")
            setContent("")
            queryClient.invalidateQueries({ queryKey: ["user_notes"] })
            onNoteCreated()
        },
    })

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Title</Label>
                <Input id="name" placeholder="Note title..." value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Note content..." value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={() => name.trim() && createNote.mutate()} disabled={createNote.isPending}>
                    {createNote.isPending ? "Adding..." : "Add Note"}
                </Button>
            </DialogFooter>
        </div>
    )
}
