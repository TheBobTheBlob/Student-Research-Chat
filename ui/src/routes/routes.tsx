import { Outlet, createRootRoute, createRoute, redirect } from "@tanstack/react-router"
import App from "@/App"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Profile from "@/pages/Profile"
import { Toaster } from "@/components/ui/sonner"
import Homepage from "@/pages/Homepage"
import { useAuthenticated } from "@/hooks/use-authenticated"
import Chats from "@/pages/Chats"
import Chat from "@/pages/Chat"

async function redirectToAppIfAuthenticated() {
    const isAuth = await useAuthenticated()
        .then(() => true)
        .catch(() => false)
    if (isAuth) {
        throw redirect({ to: appRoute.to })
    }
}

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <Toaster position="bottom-right" expand richColors closeButton />
        </>
    ),
    notFoundComponent: () => <div>404 Not Found</div>,
})

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Homepage,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
})

export const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app",
    component: App,
    beforeLoad: async () => {
        try {
            await useAuthenticated()
        } catch {
            throw redirect({ to: loginRoute.to, search: { redirect: location.href } })
        }
    },
})

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
})

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
})

export const profileRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "profile",
    component: Profile,
})
export const chatsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "chats",
    component: Chats,
})

export const chatRoute = createRoute({
    getParentRoute: () => chatsRoute,
    path: ":chatUUID",
    component: Chat,
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    appRoute.addChildren([profileRoute, chatsRoute.addChildren([chatRoute])]),
    loginRoute,
    registerRoute,
])
