import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { loginRoute, registerRoute } from "@/routes/routes"

export default function Homepage() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>This is the Homepage</h1>
            <Button onClick={() => navigate({ to: loginRoute.to })}>Login</Button>
            <Button onClick={() => navigate({ to: registerRoute.to })}>Register</Button>
        </div>
    )
}
