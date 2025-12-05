import { useEffect, useRef, useState } from "react"
import { Plus, SendHorizonal } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"
import type { UseQueryResult } from "@tanstack/react-query"
import type { UserAvatarProps } from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from "@/hooks/use-fetch"
import { useAuthenticated } from "@/hooks/use-authenticated";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar"
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
import { TaskForm } from "@/components/forms/TaskForm";
import { TaskList } from "@/components/TaskList";

export default function Chat() {
    const queryClient = useQueryClient();
    const { chatUUID } = useParams({ strict: false })
    const bottomRef = useRef<HTMLDivElement>(null)

    const { data: authData } = useQuery({
        queryKey: ["authUser"],
        queryFn: useAuthenticated,
    });

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

                            <TaskForm
                                chat_uuid={chatUUID}
                                onTaskCreated={() => {
                                    queryClient.invalidateQueries({ queryKey: ["tasks", chatUUID] })
                                }}
                            />

                            {authData && (
                                <TaskList chat_uuid={chatUUID} currentUserUuid={authData.user_uuid} />
                            )}
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
        <div className={`flex gap-3 items-start ${isOwn ? "justify-end" : "justify-start"}`}>
            {!isOwn ? <MessageAvatar /> : null}
            <div className="max-w-[70%]">
                <div className={`rounded-lg px-3 py-2 bg-secondary`}>
                    <div className="flex items-center justify-between gap-5">
                        <div className="text-sm font-medium">
                            {user.first_name} {user.last_name}
                        </div>
                        {time && <div className="text-xs text-muted-foreground mt-1">{new Date(`${time} UTC`).toLocaleString()}</div>}
                    </div>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{text}</div>
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
        <div className="flex gap-2 items-end p-2 sticky top-0 bg-background bg-sidebar">
            <h2 className="flex-1">{chatInformationQuery.isPending ? "Chat" : chatInformationQuery.data.chat_name}</h2>
        </div>
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
        <div className="flex gap-2 items-end p-2 border-t bg-sidebar">
            <Textarea
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                placeholder="Type a message and press Enter..."
                rows={1}
                onKeyDown={(e: any) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                    }
                }}
                className="resize-none flex-1"
            />
            <Button onClick={handleSend} variant="outline">
                <SendHorizonal />
                Send
            </Button>
        </div>
    )
}

interface UserListProps {
    chatInformationQuery: UseQueryResult<any, unknown>
}

function UserList({ chatInformationQuery }: UserListProps) {
    return (
        <Sidebar side="right">
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Users</SidebarGroupLabel>
                    <AddUserDialog />
                </SidebarGroup>
                <SidebarGroup className="gap-2">
                    {chatInformationQuery.isPending
                        ? "Loading..."
                        : Object.entries(chatInformationQuery.data?.users).map(([userId, user]: [any, any]) => (
                              <UserTag key={userId} user={user} />
                          ))}
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
        <SidebarMenuButton>
            <UserAvatar user={user} />
            {user.first_name} {user.last_name}
        </SidebarMenuButton>
    )
}
