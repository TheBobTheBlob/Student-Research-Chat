import { useState } from "react"
import { LogOutIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import type { UseQueryResult } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { chatsRoute } from "@/routes/routes"

interface ChatHeaderProps {
    chatInformationQuery: UseQueryResult<any, unknown>
}

export function ChatHeader({ chatInformationQuery }: ChatHeaderProps) {
    return (
        <div className="flex gap-2 items-center px-4 h-14 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <h2 className="flex-1 text-lg font-semibold">
                {chatInformationQuery.isPending ? "Chat" : chatInformationQuery.data.chat_name}
            </h2>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <LeaveChatDialog />
                        <DeleteChatDialog />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

function LeaveChatDialog() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { chatUUID } = useParams({ strict: false })
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const leaveChat = useMutation({
        mutationFn: async () => {
            const response = await useFetch({ url: "/chats/leave", data: { chat_uuid: chatUUID } })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
            toast.success("Successfully left the chat.")
            navigate({ to: chatsRoute.to })
            setDialogOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.message)
            setDialogOpen(false)
        },
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogOutIcon />
                    Leave Chat
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to leave this chat?</DialogTitle>
                    <DialogDescription>
                        You will use access to this chat and all the messages within unless you are reinvited.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => leaveChat.mutateAsync()}>
                        <LogOutIcon />
                        Leave
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteChatDialog() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { chatUUID } = useParams({ strict: false })
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const deleteChat = useMutation({
        mutationFn: async () => {
            const response = await useFetch({ url: "/chats/delete", data: { chat_uuid: chatUUID } })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
            toast.success("Chat deleted successfully.")
            navigate({ to: chatsRoute.to })
            setDialogOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.message)
            setDialogOpen(false)
        },
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2Icon />
                    Delete Chat
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this chat?</DialogTitle>
                    <DialogDescription>This will irreversibly delete this chat and all messages within.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => deleteChat.mutateAsync()}>
                        <Trash2Icon />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
