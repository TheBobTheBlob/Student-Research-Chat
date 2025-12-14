import { resolve } from "node:path"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import istanbul from "vite-plugin-istanbul"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        viteReact(),
        tailwindcss(),
        istanbul({
            include: "src/**/*",
            exclude: ["node_modules", "test/"],
            extension: [".js", ".ts", ".tsx"],
            requireEnv: false,
            forceBuildInstrument: true,
        }),
    ],
    server: {
        host: "0.0.0.0",
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        sourcemap: true,
    },
})
