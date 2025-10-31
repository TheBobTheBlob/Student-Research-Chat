import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import {
    Outlet,
    RouterProvider,
    createRootRoute,
    createRoute,
    createRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx"

import "./styles.css"
import reportWebVitals from "./reportWebVitals.ts"

import App from "./App.tsx"
import { ThemeProvider } from "./components/ThemeProvider.tsx"

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    notFoundComponent: () => <div>404 Not Found</div>,
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
    routeTree,
    context: {
        ...TanStackQueryProviderContext,
    },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    <RouterProvider router={router} />
                </ThemeProvider>
            </TanStackQueryProvider.Provider>
        </StrictMode>,
    )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
