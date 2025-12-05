import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex w-full flex-1 flex-col bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-blue-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-blue-950/20">
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
