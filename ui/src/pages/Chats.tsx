import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"
import { ChatGrid } from "@/components/ChatGrid"

export default function Chats() {
    const chats = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await useFetch({ url: "/chats/list", data: {} })
            return response
        },
    })

    if (chats.isPending) {
        return <div className="p-8 text-center text-muted-foreground">Loading chats...</div>
    }

    if (chats.isError) {
        return <div className="p-8 text-center text-destructive">Error loading chats.</div>
    }

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-8">Chats</h1>
            <ChatGrid chats={chats.data} />
        </div>
    )
}
