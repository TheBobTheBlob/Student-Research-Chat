import { useEffect, useRef, useState } from "react"
import { LogOutIcon, MoreHorizontalIcon, Plus, SendHorizonal, Trash2Icon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"
import type { UseQueryResult } from "@tanstack/react-query"
import type { UserAvatarProps } from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from "@/hooks/use-fetch"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar"
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
import { FieldGroup } from "@/components/ui/field"
import TextField from "@/components/forms/TextField"
import UserAvatar from "@/components/UserAvatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { chatsRoute } from "@/routes/routes"
import { cn } from "@/lib/utils"
import { TaskForm } from "@/components/forms/TaskForm"
import { TaskList } from "@/components/TaskList"

export default function Chat() {
    const queryClient = useQueryClient()
    const { chatUUID } = useParams({ strict: false })
    const bottomRef = useRef<HTMLDivElement>(null)

    const messagesQuery = useQuery({
        queryKey: ["messages", "new", chatUUID],
        queryFn: async () => {
            if (!chatUUID) return []
            const response = await useFetch({ url: "/messages/list", data: { chat_uuid: chatUUID } })
            return response ?? []
        },
        enabled: !!chatUUID,
    })

    const chatInformationQuery = useQuery({
        queryKey: ["chat", chatUUID],
        queryFn: async () => {
            if (!chatUUID) return null
            const response = await useFetch({ url: "/chats/info", data: { chat_uuid: chatUUID } })
            return response ?? null
        },
        enabled: !!chatUUID,
    })

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messagesQuery.data?.messages])

    return (
        <>
            <div className="flex flex-row h-screen">
                <div className="flex flex-col flex-1 min-h-0">
                    <ChatHeader chatInformationQuery={chatInformationQuery} />
                    <div id="chat" className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 p-4">
                        {messagesQuery.isPending || chatInformationQuery.isPending
                            ? null
                            : messagesQuery.data.messages?.map((msg: any) => (
                                  <ChatMessage
                                      key={msg.message_uuid}
                                      id={msg.message_uuid}
                                      user={chatInformationQuery.data.users[msg.user_uuid]}
                                      text={msg.content}
                                      time={new Date(msg.timestamp).toLocaleString()}
                                      isOwn={msg.user_uuid === messagesQuery.data.current_user_uuid}
                                  />
                              ))}

                        {/* Tasks Section */}
                        <div className="tasks-section mt-6 p-4 border-t">
                            <h3 className="font-bold text-lg mb-2">Tasks</h3>

                            {chatUUID ? (
                                <TaskForm
                                    chat_uuid={chatUUID}
                                    onTaskCreated={() => {
                                        queryClient.invalidateQueries({ queryKey: ["tasks", chatUUID] })
                                    }}
                                />
                            ) : null}

                            <TaskList chat_uuid={chatUUID} />
                        </div>

                        <div ref={bottomRef} />
                    </div>
                    <ChatInput />
                </div>
                <UserList chatInformationQuery={chatInformationQuery} />
            </div>
        </>
    )
}

export type ChatMessageType = {
    id: string
    user: UserAvatarProps["user"]
    text: string
    time?: string
    avatar?: string
    isOwn?: boolean
}

function ChatMessage({ user, text, time, isOwn }: ChatMessageType) {
    function MessageAvatar() {
        return (
            <div className="flex-none">
                <UserAvatar user={user} />
            </div>
        )
    }

    return (
        <div className={cn("flex gap-3 items-end mb-4", isOwn ? "justify-end" : "justify-start")}>
            {!isOwn ? <MessageAvatar /> : null}
            <div className={cn("max-w-[70%] flex flex-col", isOwn ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs text-muted-foreground font-medium">
                        {user.first_name} {user.last_name}
                    </span>
                    {time && (
                        <span className="text-xs text-muted-foreground">
                            {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                </div>
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2 shadow-sm text-sm whitespace-pre-wrap break-words",
                        isOwn ? "bg-blue-600 text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm",
                    )}
                >
                    {text}
                </div>
            </div>
            {isOwn ? <MessageAvatar /> : null}
        </div>
    )
}

interface ChatHeaderProps {
    chatInformationQuery: UseQueryResult<any, unknown>
}

function ChatHeader({ chatInformationQuery }: ChatHeaderProps) {
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

function ChatInput() {
    const [value, setValue] = useState("")
    const { chatUUID } = useParams({ strict: false })
    const queryClient = useQueryClient()

    const sendChat = useMutation({
        mutationFn: async (message: string) => {
            const response = await useFetch({ url: "/messages/new", data: { content: message, chat_uuid: chatUUID } })
            return response
        },
        onSuccess: () => {
            setValue("")
            queryClient.invalidateQueries({ queryKey: ["messages", "new", chatUUID] })
        },
    })

    function handleSend() {
        const trimmed = value.trim()
        if (!trimmed) return
        sendChat.mutateAsync(trimmed)
    }

    return (
        <div className="p-4 bg-background border-t">
            <div className="flex gap-2 items-end max-w-4xl mx-auto w-full">
                <Textarea
                    value={value}
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    onKeyDown={(e: any) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                        }
                    }}
                    className="resize-none flex-1 min-h-[2.5rem] max-h-32"
                />
                <Button
                    onClick={handleSend}
                    size="icon"
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10"
                >
                    <SendHorizonal className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    )
}

interface UserListProps {
    chatInformationQuery: UseQueryResult<any, unknown>
}

function UserList({ chatInformationQuery }: UserListProps) {
    return (
        <Sidebar side="right" className="border-l border-border">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Actions</SidebarGroupLabel>
                    <AddUserDialog />
                </SidebarGroup>
                <SidebarGroup className="gap-2">
                    <SidebarGroupLabel>Users</SidebarGroupLabel>
                    {chatInformationQuery.isPending
                        ? "Loading..."
                        : Object.entries(chatInformationQuery.data?.users)
                              .filter(([_, user]: [any, any]) => user.role !== "removed")
                              .map(([userUUID, user]: [any, any]) => <UserTag key={userUUID} user={user} />)}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

const newChatFormSchema = z.object({
    email: z.email(),
})

function AddUserDialog() {
    const queryClient = useQueryClient()
    const { chatUUID } = useParams({ strict: false })
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const form = useForm({
        defaultValues: {
            email: "",
        },
        validators: {
            onSubmit: newChatFormSchema,
        },
        onSubmit: ({ value }) => {
            addUser.mutateAsync(value.email)
        },
    })

    const addUser = useMutation({
        mutationFn: async (email: string) => {
            const response = await useFetch({ url: "/chats/add-user", data: { user_email: email, chat_uuid: chatUUID } })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat", chatUUID] })
            toast.success("User added successfully.")
            form.reset()
            setDialogOpen(false)
        },
        onError: (error: any) => toast.error(error.message),
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton onClick={() => setDialogOpen(true)}>
                    <Plus />
                    Add User
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User to Chat</DialogTitle>
                    <DialogDescription>Add another user to this group chat.</DialogDescription>
                </DialogHeader>
                <form
                    id="add-user-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <TextField form={form} name="email" label="Email" />
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="add-user-form">
                        Add User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface UserTagProps {
    user: { first_name: string; last_name: string }
}

function UserTag({ user }: UserTagProps) {
    return (
        <SidebarMenuButton className="h-auto py-0.5">
            <UserAvatar user={user} className="h-8 w-8" />
            <div className="flex flex-col items-start text-sm">
                <span className="font-medium">
                    {user.first_name} {user.last_name}
                </span>
            </div>
        </SidebarMenuButton>
    )
}
