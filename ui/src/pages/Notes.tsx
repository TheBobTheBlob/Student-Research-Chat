import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useFetch } from "@/hooks/use-fetch"
import { NoteGrid } from "@/components/NoteGrid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NoteForm } from "@/components/forms/NoteForm"

export default function Notes() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const notesQuery = useQuery({
        queryKey: ["user_notes"],
        queryFn: async () => {
            const response = await useFetch({ url: "/notes/list", data: {} })
            return response.notes ?? []
        },
    })

    if (notesQuery.isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading notes...</div>
    }

    if (notesQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading notes.</div>
    }

    const notes = notesQuery.data ?? []

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Notes</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Note</DialogTitle>
                            <DialogDescription>Create a new note.</DialogDescription>
                        </DialogHeader>
                        <NoteForm onNoteCreated={() => setIsDialogOpen(false)} onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <NoteGrid notes={notes} />
        </div>
    )
}
