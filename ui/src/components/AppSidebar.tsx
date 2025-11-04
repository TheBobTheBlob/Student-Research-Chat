import { Calendar, CircleUser, Home, ListTodo, MessageCircle, Settings } from "lucide-react"
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

export default function AppSidebar() {
    const dashboardButtons = [
        { title: "Home", icon: Home, to: "/home" },
        { title: "Chats", icon: MessageCircle, to: "/dashboard" },
        { title: "Tasks", icon: ListTodo, to: "/Tasks" },
        { title: "Meetings", icon: Calendar, to: "/meetings" },
    ]

    const footerButtons = [
        { title: "Settings", icon: Settings, to: "/settings" },
        { title: "Profile", icon: CircleUser, to: profileRoute.to },
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
    buttons: Array<{
        title: string
        icon: React.ComponentType<any>
        to: string
    }>
}

function SidebarButtonsFromArray({ buttons }: SidebarButtonsFromArrayProps) {
    const navigate = useNavigate()

    return buttons.map((button) => (
        <SidebarMenuItem key={button.title}>
            <SidebarMenuButton onClick={() => navigate({ to: button.to })}>
                <button.icon />
                <span>{button.title}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ))
}
