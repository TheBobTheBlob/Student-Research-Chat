import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"
import App from "@/App"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Profile from "@/pages/Profile"
import { Toaster } from "@/components/ui/sonner"

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
    component: App,
})

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
})

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
})

export const profileRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "profile",
    component: Profile,
})

export const routeTree = rootRoute.addChildren([indexRoute.addChildren([profileRoute]), loginRoute, registerRoute])
