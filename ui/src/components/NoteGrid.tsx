import { useState } from "react"
import { StickyNote, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFetch } from "@/hooks/use-fetch"

interface NoteGridProps {
    notes: Array<any>
}

function NoteCard({ note }: { note: any }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const deleteNote = useMutation({
        mutationFn: async () => {
            await useFetch({
                url: "/notes/delete",
                data: { note_uuid: note.note_uuid },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user_notes"] })
            toast.success("Note deleted successfully")
            setIsDeleteDialogOpen(false)
        },
        onError: () => {
            toast.error("Failed to delete note")
        },
    })

    return (
        <>
            <Card
                className="h-full transition-all duration-200 hover:shadow-md hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 group relative cursor-pointer"
                onClick={() => setIsViewDialogOpen(true)}
            >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white mt-1">
                        <StickyNote className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors pr-8">
                            {note.note_name}
                        </CardTitle>
                        <CardDescription className="mt-1">{new Date(`${note.timestamp}Z`).toLocaleString()}</CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsDeleteDialogOpen(true)
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{note.content}</p>
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Note</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this note? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => deleteNote.mutate()} disabled={deleteNote.isPending}>
                            {deleteNote.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{note.note_name}</DialogTitle>
                        <DialogDescription>{new Date(`${note.timestamp}Z`).toLocaleString()}</DialogDescription>
                    </DialogHeader>
                    <div className="whitespace-pre-wrap text-sm text-foreground mt-4">{note.content}</div>
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export function NoteGrid({ notes }: NoteGridProps) {
    if (notes.length === 0) {
        return <div className="text-center text-muted-foreground py-12">No notes found.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note: any) => (
                <NoteCard key={note.note_uuid} note={note} />
            ))}
        </div>
    )
}
