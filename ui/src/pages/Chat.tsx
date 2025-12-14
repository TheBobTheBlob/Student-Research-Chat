import { useEffect, useRef, useState } from "react"
import { SendHorizonal } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import type { UserAvatarProps } from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from "@/hooks/use-fetch"
import UserAvatar from "@/components/UserAvatar"
import { cn } from "@/lib/utils"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatSidebar } from "@/components/chat/ChatSidebar"

export default function Chat() {
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
                                      time={new Date(`${msg.timestamp}Z`)}
                                      isOwn={msg.user_uuid === messagesQuery.data.current_user_uuid}
                                  />
                              ))}

                        <div ref={bottomRef} />
                    </div>
                    <ChatInput />
                </div>
                <ChatSidebar chatInformationQuery={chatInformationQuery} />
            </div>
        </>
    )
}

export type ChatMessageType = {
    id: string
    user: UserAvatarProps["user"]
    text: string
    time?: Date
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
        <div className={cn("chat-message", "flex gap-3 items-end mb-4", isOwn ? "justify-end" : "justify-start")}>
            {!isOwn ? <MessageAvatar /> : null}
            <div className={cn("max-w-[70%] flex flex-col", isOwn ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs text-muted-foreground font-medium">
                        {user.first_name} {user.last_name}
                    </span>
                    {time && <span className="text-xs text-muted-foreground">{time.toLocaleString()}</span>}
                </div>
                <div
                    className={cn(
                        "chat-message--text",
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
                    data-testid="send-message-button"
                >
                    <SendHorizonal className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    )
}
