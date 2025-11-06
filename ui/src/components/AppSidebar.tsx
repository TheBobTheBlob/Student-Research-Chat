import { Calendar, CircleUser, Home, ListTodo, LogOut, MessageCircle, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
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
import { profileRoute } from "@/routes/routes"
import { useLogout } from "@/hooks/use-logout"

interface AppSideBarButton {
    title: string
    icon: React.ComponentType<any>
    to?: string
    onClick?: () => any
}

export default function AppSidebar() {
    const makeLogout = useLogout()

    const dashboardButtons: Array<AppSideBarButton> = [
        { title: "Home", icon: Home, to: "/home" },
        { title: "Chats", icon: MessageCircle, to: "/dashboard" },
        { title: "Tasks", icon: ListTodo, to: "/Tasks" },
        { title: "Meetings", icon: Calendar, to: "/meetings" },
    ]

    const footerButtons: Array<AppSideBarButton> = [
        { title: "Settings", icon: Settings, to: "/settings" },
        { title: "Profile", icon: CircleUser, to: profileRoute.to },
        { title: "Logout", icon: LogOut, onClick: makeLogout },
    ]

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
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarButtonsFromArray buttons={footerButtons} />
            </SidebarFooter>
        </Sidebar>
    )
}

interface SidebarButtonsFromArrayProps {
    buttons: Array<AppSideBarButton>
}

function SidebarButtonsFromArray({ buttons }: SidebarButtonsFromArrayProps) {
    const navigate = useNavigate()

    return buttons.map((button) => (
        <SidebarMenuItem key={button.title}>
            <SidebarMenuButton
                onClick={() => {
                    if (button.onClick) {
                        button.onClick()
                    }
                    if (button.to) {
                        navigate({ to: button.to })
                    }
                }}
            >
                <button.icon />
                <span>{button.title}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ))
}
