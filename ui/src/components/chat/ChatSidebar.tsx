import { useState } from "react"
import { Plus } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"
import type { UseQueryResult } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar"
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
import { TaskList } from "@/components/TaskList"
import { AnnouncementList } from "@/components/AnnouncementList"
import { MeetingList } from "@/components/MeetingList"
import { AddTaskDialog } from "@/components/dialogs/AddTaskDialog"
import { AddAnnouncementDialog } from "@/components/dialogs/AddAnnouncementDialog"
import { AddMeetingDialog } from "@/components/dialogs/AddMeetingDialog"
import { appRoute } from "@/routes/routes"

interface ChatSidebarProps {
    chatInformationQuery: UseQueryResult<any, unknown>
}

export function ChatSidebar({ chatInformationQuery }: ChatSidebarProps) {
    const { chatUUID } = useParams({ strict: false })
    const { currentUser } = appRoute.useRouteContext()

    return (
        <Sidebar side="right" className="border-l border-border">
            <SidebarContent>
                <div className="h-14" />
                <SidebarGroup>
                    <SidebarGroupLabel>Announcements</SidebarGroupLabel>
                    {currentUser.user_type === "professor" ? (
                        <SidebarGroupAction title="Add Announcement">
                            <AddAnnouncementDialog />
                        </SidebarGroupAction>
                    ) : null}
                    <AnnouncementList chatUUID={chatUUID} onlyUnread />
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Meetings</SidebarGroupLabel>
                    {currentUser.user_type === "professor" ? (
                        <SidebarGroupAction title="Add Meeting">
                            <AddMeetingDialog />
                        </SidebarGroupAction>
                    ) : null}
                    <MeetingList chatUUID={chatUUID} />
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                    <SidebarGroupAction title="Add Task">
                        <AddTaskDialog />
                    </SidebarGroupAction>
                    <TaskList chatUUID={chatUUID} />
                </SidebarGroup>
                <SidebarGroup className="gap-2">
                    <SidebarGroupLabel>Users</SidebarGroupLabel>
                    <SidebarGroupAction title="Add User">
                        <AddUserDialog />
                    </SidebarGroupAction>
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
                <Plus onClick={() => setDialogOpen(true)} />
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
