import { HeadContent, Outlet, createRootRoute, createRoute, redirect } from "@tanstack/react-router"
import App from "@/App"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Profile from "@/pages/Profile"
import { Toaster } from "@/components/ui/sonner"
import Homepage from "@/pages/Homepage"
import LandingPage from "@/pages/LandingPage"
import { useAuthenticated } from "@/hooks/use-authenticated"
import Chats from "@/pages/Chats"
import Chat from "@/pages/Chat"
import Tasks from "@/pages/Tasks"
import Notes from "@/pages/Notes"
import Announcements from "@/pages/Announcements"

import Meetings from "@/pages/Meetings"

async function redirectToAppIfAuthenticated() {
    const isAuth = await useAuthenticated()
        .then(() => true)
        .catch(() => false)
    if (isAuth) {
        throw redirect({ to: homeRoute.to })
    }
}

function pageTitle(title?: string) {
    return () => ({
        meta: [
            {
                title: title ? `${title} - StudentChat` : "StudentChat",
            },
        ],
    })
}

const rootRoute = createRootRoute({
    component: () => (
        <>
            <HeadContent />
            <Outlet />
            <Toaster position="bottom-right" expand richColors />
        </>
    ),
    notFoundComponent: () => <div>404 Not Found</div>,
})

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LandingPage,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
    head: pageTitle(),
})

export const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app",
    component: App,
    beforeLoad: async () => {
        try {
            const user = await useAuthenticated()
            return { currentUser: user }
        } catch {
            throw redirect({ to: loginRoute.to, search: { redirect: location.href } })
        }
    },
})

export const appIndexRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({ to: homeRoute.to })
    },
})

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
    head: pageTitle("Login"),
})

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
    beforeLoad: async () => await redirectToAppIfAuthenticated(),
    head: pageTitle("Register"),
})

export const homeRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "home",
    component: Homepage,
    head: pageTitle("Home"),
})

export const profileRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "profile",
    component: Profile,
    head: pageTitle("Profile"),
})

export const chatsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "chats",
    component: Chats,
    head: pageTitle("Chats"),
})

export const chatRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "chat/$chatUUID",
    component: Chat,
    head: pageTitle("Chat"),
})

export const tasksRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "/tasks",
    component: Tasks,
    head: pageTitle("Tasks"),
})

export const notesRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "/notes",
    component: Notes,
    head: pageTitle("Notes"),
})

export const annoucementsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "/announcements",
    component: Announcements,
    head: pageTitle("Announcements"),
})

export const meetingsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: "/meetings",
    component: Meetings,
    head: pageTitle("Meetings"),
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    appRoute.addChildren([
        appIndexRoute,
        homeRoute,
        profileRoute,
        chatsRoute,
        chatRoute,
        tasksRoute,
        notesRoute,
        annoucementsRoute,
        meetingsRoute,
    ]),
    loginRoute,
    registerRoute,
])
