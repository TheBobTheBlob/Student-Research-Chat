import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import App from "@/App"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import { Toaster } from "@/components/ui/sonner"

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
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

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
})

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register,
})

export const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute])
