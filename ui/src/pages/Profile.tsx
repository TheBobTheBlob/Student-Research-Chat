import { useQuery } from "@tanstack/react-query"
import { GraduationCap, Mail, Shield, User } from "lucide-react"

import UserAvatar from "@/components/UserAvatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthenticated } from "@/hooks/use-authenticated"

export default function Profile() {
    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: useAuthenticated,
    })

    if (userQuery.isPending) {
        return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>
    }

    if (userQuery.isError) {
        return <div className="p-8 text-center text-destructive">Error loading profile.</div>
    }

    const user = userQuery.data

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardContent className="flex flex-col md:flex-row items-center gap-6 pt-6">
                        <div className="h-24 w-24 rounded-full border-4 border-background shadow-xl">
                            <UserAvatar user={user} className="h-full w-full text-2xl" />
                        </div>
                        <div className="text-left space-y-1">
                            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                    {user.user_type}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/30 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle>Personal Info</CardTitle>
                            <CardDescription>Your basic details</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">First Name</p>
                                <p className="font-medium">{user.first_name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Last Name</p>
                                <p className="font-medium">{user.last_name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/30 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle>Account Type</CardTitle>
                            <CardDescription>Your role in the system</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium capitalize">{user.user_type}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
