import { Link } from "@tanstack/react-router"
import { ArrowRight, CheckCircle2, Github, MessageCircle, Shield, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loginRoute, registerRoute } from "@/routes/routes"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
                        <MessageCircle className="w-6 h-6" />
                        <span>StudentChat</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/TheBobTheBlob/Student-Research-Chat"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <Link to={loginRoute.to}>
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link to={registerRoute.to}>
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 text-center px-4">
                    <div className="container mx-auto max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Collaborate on Research with Ease
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            The all-in-one platform for students to manage research projects, communicate in real-time, and track tasks
                            efficiently.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={registerRoute.to}>
                                <Button size="lg" className="h-12 px-8 text-lg gap-2">
                                    Start Collaborating <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to={loginRoute.to}>
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    Existing User?
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16">Everything you need to succeed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={<MessageCircle className="w-10 h-10 text-blue-500" />}
                                title="Real-time Chat"
                                description="Instant messaging designed for research groups. Share ideas, files, and updates seamlessly."
                            />
                            <FeatureCard
                                icon={<CheckCircle2 className="w-10 h-10 text-green-500" />}
                                title="Task Management"
                                description="Keep your project on track. Assign tasks, set deadlines, and monitor progress in one place."
                            />
                            <FeatureCard
                                icon={<Users className="w-10 h-10 text-purple-500" />}
                                title="Team Collaboration"
                                description="Built for groups. Manage roles, organize discussions, and keep everyone aligned."
                            />
                        </div>
                    </div>
                </section>

                {/* Social Proof / Trust */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                                <Shield className="w-12 h-12 text-blue-600" />
                                <h3 className="text-xl font-semibold">Secure & Private</h3>
                                <p className="text-muted-foreground">Your research data is protected with enterprise-grade security.</p>
                            </div>
                            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                                <Zap className="w-12 h-12 text-indigo-600" />
                                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                                <p className="text-muted-foreground">Built on modern tech for instant updates and zero lag.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Student Research Chat. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 rounded-xl bg-background border shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 p-3 bg-muted/50 rounded-lg w-fit">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}
