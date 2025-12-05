import { Link } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { chatRoute } from "@/routes/routes"

interface ChatGridProps {
    chats: Array<any>
}

export function ChatGrid({ chats }: ChatGridProps) {
    if (chats.length === 0) {
        return <div className="text-center text-muted-foreground py-12">No chats found. Start a new conversation!</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat: any) => (
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
    )
}
