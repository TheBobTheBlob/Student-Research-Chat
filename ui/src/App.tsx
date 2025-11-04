import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/AppSidebar"
import AppTopbar from "./components/AppTopbar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <AppTopbar />
            <main className="flex w-full flex-1 flex-col">
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
