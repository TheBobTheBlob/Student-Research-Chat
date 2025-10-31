import AppSidebar from "./components/AppSidebar"
import AppTopbar from "./components/AppTopbar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <AppTopbar />
        </SidebarProvider>
    )
}
