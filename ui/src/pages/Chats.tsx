import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { chatRoute } from "@/routes/routes"

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
            {chats.data.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">No chats found. Start a new conversation!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chats.data.map((chat: any) => (
                        <Link key={chat.chat_uuid} to={chatRoute.to} params={{ chatUUID: chat.chat_uuid }} className="block group">
                            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-blue-500/30 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                            {chat.chat_name}
                                        </CardTitle>
                                        <CardDescription className="truncate">
                                            Created {new Date(chat.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
