import { useState } from "react"
import { AlertCircle, Calendar, CheckCircle2, Clock, ListTodo } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskDialog } from "@/components/dialogs/TaskDialog"
import { cn } from "@/lib/utils"

interface TaskGridProps {
    tasks: Array<any>
}

export function TaskGrid({ tasks }: TaskGridProps) {
    const [selectedTask, setSelectedTask] = useState<any>(null)

    if (tasks.length === 0) {
        return <div className="text-center text-muted-foreground py-12">No tasks found.</div>
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task: any) => (
                    <Card
                        key={task.task_uuid}
                        className="h-full transition-all duration-200 hover:shadow-md hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 group cursor-pointer py-3"
                        onClick={() => setSelectedTask(task)}
                    >
                        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-1 px-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white mt-1">
                                {task.status === "completed" ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : task.status === "in_progress" ? (
                                    <Clock className="w-5 h-5" />
                                ) : (
                                    <ListTodo className="w-5 h-5" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                    {task.title}
                                </CardTitle>
                                <CardDescription className="mt-1 capitalize flex items-center gap-1.5">
                                    <span
                                        className={cn(
                                            "inline-block w-2 h-2 rounded-full",
                                            task.status === "completed"
                                                ? "bg-green-500"
                                                : task.status === "in_progress"
                                                  ? "bg-blue-500"
                                                  : "bg-slate-400",
                                        )}
                                    />
                                    {task.status.replace("_", " ")}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        {task.description && (
                            <CardContent className="pb-1 px-3">
                                <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
                            </CardContent>
                        )}
                        <CardContent className="pt-0 pb-2 px-3">
                            <div className="flex flex-wrap gap-2 mt-2">
                                {task.priority && (
                                    <div
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                                            task.priority === "high"
                                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
                                                : task.priority === "medium"
                                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50"
                                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50",
                                        )}
                                    >
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="capitalize">{task.priority}</span>
                                    </div>
                                )}

                                {task.due_date && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground px-2.5 py-1 rounded-full border bg-muted/30 text-xs font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <TaskDialog
                task={selectedTask}
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTask(null)}
                onClose={() => setSelectedTask(null)}
                canEdit={true}
            />
        </>
    )
}
