import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Profile() {
    return (
        <div className="flex flex-row min-h-screen justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent>This is your profile page.</CardContent>
            </Card>
        </div>
    )
}
