import { useNavigate } from "@tanstack/react-router"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { indexRoute, registerRoute } from "@/routes/routes"
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
            navigate({ to: indexRoute.to })
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
        <div className="flex flex-row min-h-screen justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardAction>
                        <Button variant="outline" onClick={() => navigate({ to: registerRoute.to })}>
                            Sign Up
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form
                        id="login-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup>
                            <TextField form={form} name="email" label="Email" />
                            <TextField form={form} name="password" type="password" label="Password" />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" form="login-form">
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
