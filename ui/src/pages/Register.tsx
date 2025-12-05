import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import TextField from "@/components/forms/TextField"
import SelectField from "@/components/forms/SelectField"
import { useFetch } from "@/hooks/use-fetch"
import { loginRoute } from "@/routes/routes"

const formSchema = z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    email: z.email("Invalid email address."),
    password: z.string().min(5, "Password must be at least 5 characters."),
    user_type: z.enum(["Student", "Researcher"]),
})

export default function Register() {
    const navigate = useNavigate()

    const registerUser = useMutation({
        mutationFn: async (data: { first_name: string; last_name: string; email: string; password: string; user_type: string }) => {
            return await useFetch({ url: "/users/register", data })
        },
        onSuccess: () => {
            toast.success("User registered successfully!")
            navigate({ to: loginRoute.to })
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const form = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            user_type: "Student",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: ({ value }) => {
            toast.promise(registerUser.mutateAsync(value))
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
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <p className="text-center text-sm text-muted-foreground">Enter your information to create an account</p>
                </CardHeader>
                <CardContent>
                    <form
                        id="register-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                        className="grid gap-4"
                    >
                        <FieldGroup>
                            <div className="flex w-full flex-row gap-2">
                                <TextField form={form} name="first_name" label="First Name" />
                                <TextField form={form} name="last_name" label="Last Name" />
                            </div>
                            <TextField form={form} name="email" label="Email" />
                            <TextField form={form} name="password" type="password" label="Password" />
                            <SelectField form={form} name="user_type" label="Type" options={formSchema.shape.user_type} />
                        </FieldGroup>
                        <Button type="submit" className="w-full" form="register-form">
                            Create account
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to={loginRoute.to}
                            className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
