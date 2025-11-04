import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="flex flex-row min-h-screen justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardAction>
                        <Button variant="outline" onClick={() => navigate({ to: loginRoute.to })}>
                            Login
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form
                        id="register-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
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
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" form="register-form">
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
