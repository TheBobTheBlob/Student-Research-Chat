import { Link, useNavigate } from "@tanstack/react-router"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { appRoute, registerRoute } from "@/routes/routes"
import { useFetch } from "@/hooks/use-fetch"
import { FieldGroup } from "@/components/ui/field"
import TextField from "@/components/forms/TextField"

const formSchema = z.object({
    email: z.email("Invalid email address."),
    password: z.string().min(5, "Password must be at least 5 characters."),
})

export default function Login() {
    const navigate = useNavigate()

    const login = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            return await useFetch({ url: "/users/login", data })
        },
        onSuccess: () => {
            navigate({ to: appRoute.to })
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: ({ value }) => {
            toast.promise(login.mutateAsync(value))
        },
    })

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
            <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                <MessageCircle className="h-8 w-8" />
                <span>StudentChat</span>
            </div>
            <Card className="w-full max-w-sm border-none shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <p className="text-center text-sm text-muted-foreground">Enter your email below to login to your account</p>
                </CardHeader>
                <CardContent>
                    <form
                        id="login-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                        className="grid gap-4"
                    >
                        <FieldGroup>
                            <TextField form={form} name="email" label="Email" />
                            <TextField form={form} name="password" type="password" label="Password" />
                        </FieldGroup>
                        <Button type="submit" className="w-full" form="login-form">
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            to={registerRoute.to}
                            className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
