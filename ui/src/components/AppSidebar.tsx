import { useState } from "react"
import { Calendar, CircleUser, Home, ListTodo, LogOut, MessageCircle, Plus, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
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
import { FieldGroup } from "./ui/field"
import TextField from "./forms/TextField"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import type { AppSidebarChatButton } from "./types"
import { chatRoute, chatsRoute, profileRoute } from "@/routes/routes"
import { useLogout } from "@/hooks/use-logout"
import { useFetch } from "@/hooks/use-fetch"

interface AppSideBarButton {
    title: string
    icon: React.ComponentType<any>
    to?: string
    toParams?: Record<string, any>
    onClick?: () => any
}

export default function AppSidebar() {
    const makeLogout = useLogout()

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
                    <NewChatDialog />
                    {chats.isPending ? null : (
                        <>
                            <SidebarButtonsFromArray
                                buttons={chats.data.map((chat: AppSidebarChatButton) => ({
                                    title: chat.chat_name,
                                    icon: MessageCircle,
                                    to: chatRoute.to,
                                    toParams: { chatUUID: chat.chat_uuid },
                                }))}
                            />
                        </>
                    )}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarButtonsFromArray buttons={footerButtons} />
            </SidebarFooter>
        </Sidebar>
    )
}

const newChatFormSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character."),
})

function NewChatDialog() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const form = useForm({
        defaultValues: {
            name: "",
        },
        validators: {
            onSubmit: newChatFormSchema,
        },
        onSubmit: ({ value }) => {
            newChat.mutateAsync(value.name)
        },
    })

    const newChat = useMutation({
        mutationFn: async (chatName: string) => {
            const response = await useFetch({ url: "/chats/new", data: { name: chatName } })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
            toast.success("Chat created successfully.")
        },
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <SidebarButton title="New Chat" icon={Plus} onClick={() => setDialogOpen(true)} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                    <DialogDescription>Create a new group chat.</DialogDescription>
                </DialogHeader>
                <form
                    id="new-chat-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <TextField form={form} name="name" label="Name" />
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="new-chat-form" onClick={() => setDialogOpen(false)}>
                        Create Chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SidebarButton({ title, icon, to, toParams, onClick }: AppSideBarButton) {
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
                        navigate({ to: to, params: toParams || {} })
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
        <SidebarButton
            key={button.title}
            title={button.title}
            icon={button.icon}
            to={button.to}
            onClick={button.onClick}
            toParams={button.toParams}
        />
    ))
}
