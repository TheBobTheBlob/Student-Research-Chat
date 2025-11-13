import { useState } from "react"
import { Calendar, CircleUser, Home, ListTodo, LogOut, MessageCircle, Plus, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import type { AppSidebarChatButton } from "./types"
import { chatsRoute, profileRoute } from "@/routes/routes"
import { useLogout } from "@/hooks/use-logout"
import { useFetch } from "@/hooks/use-fetch"
import {} from "@radix-ui/react-dialog"

interface AppSideBarButton {
    title: string
    icon: React.ComponentType<any>
    to?: string
    onClick?: () => any
}

export default function AppSidebar() {
    const makeLogout = useLogout()
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const dashboardButtons: Array<AppSideBarButton> = [
        { title: "Home", icon: Home, to: "/home" },
        { title: "Chats", icon: MessageCircle, to: chatsRoute.to },
        { title: "Tasks", icon: ListTodo, to: "/tasks" },
        { title: "Meetings", icon: Calendar, to: "/meetings" },
    ]

    const footerButtons: Array<AppSideBarButton> = [
        { title: "Settings", icon: Settings, to: "/settings" },
        { title: "Profile", icon: CircleUser, to: profileRoute.to },
        { title: "Logout", icon: LogOut, onClick: makeLogout },
    ]

    const chats = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await useFetch({ url: "/chats/list", data: {} })
            return response
        },
    })

    const newChat = useMutation({
        mutationFn: async (chatName: string) => {
            const response = await useFetch({ url: "/chats/new", data: { name: chatName } })
            console.log(response)
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
        },
    })

    function handleNewChat() {
        newChat.mutate("Some Chat")
    }

    return (
        <Sidebar side="left" collapsible="icon">
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
                    <SidebarButtonsFromArray buttons={dashboardButtons} />
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <SidebarButton title="New Chat" icon={Plus} onClick={() => setDialogOpen(true)} />
                            {/* <Button variant="outline">
                                <>
                                    <Plus />
                                    New Chat
                                </>
                            </Button> */}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>New Chat</DialogTitle>
                                <DialogDescription>Create a new group chat.</DialogDescription>
                            </DialogHeader>
                            {/* <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username-1">Username</Label>
                        <Input id="username-1" name="username" defaultValue="@peduarte" />
                    </div>
                </div> */}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {/* <SidebarButton title="New Chat" icon={Plus} onClick={() => handleNewChat()} /> */}
                    {chats.isPending ? null : (
                        <SidebarButtonsFromArray
                            buttons={
                                chats.data.map((chat: AppSidebarChatButton) => ({
                                    title: chat.chat_name,
                                    icon: MessageCircle,
                                    to: `/chats/${chat.chat_uuid}`,
                                }))
                                // <SidebarButton
                                //     key={chat.chat_uuid}
                                //     title={chat.chat_name}
                                //     icon={MessageCircle}
                                //     to={`/chats/${chat.chat_uuid}`}
                                // />
                            }
                        />
                    )}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarButtonsFromArray buttons={footerButtons} />
            </SidebarFooter>
        </Sidebar>
    )
}

function SidebarButton({ title, icon, to, onClick }: AppSideBarButton) {
    const navigate = useNavigate()
    const Icon = icon

    return (
        <SidebarMenuItem key={title}>
            <SidebarMenuButton
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                    if (to) {
                        navigate({ to: to })
                    }
                }}
            >
                <Icon />
                <span>{title}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

interface SidebarButtonsFromArrayProps {
    buttons: Array<AppSideBarButton>
}

function SidebarButtonsFromArray({ buttons }: SidebarButtonsFromArrayProps) {
    return buttons.map((button) => (
        <SidebarButton key={button.title} title={button.title} icon={button.icon} to={button.to} onClick={button.onClick} />
    ))
}
