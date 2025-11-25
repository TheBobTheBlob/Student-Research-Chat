import { useQuery } from "@tanstack/react-query"
import { useFetch } from "@/hooks/use-fetch"

export function TaskList({ chat_uuid }: { chat_uuid?: string }) {
  const tasksQuery = useQuery({
    queryKey: ["tasks", chat_uuid ?? "all-user"],
    queryFn: async () => {
      const url = chat_uuid ? `/tasks/list?chat_uuid=${chat_uuid}` : "/tasks/all";
      const res = await useFetch({
        url,
        method: "POST",
        data: {}, 
      });
      return res?.tasks ?? [];
    },
  });

  if (tasksQuery.isLoading) return <div>Loading tasks...</div>;
  if (tasksQuery.isError) return <div>Error loading tasks.</div>;

  const tasks = tasksQuery.data ?? [];

  if (tasks.length === 0)
    return <div className="text-sm text-muted-foreground">No tasks yet.</div>;

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task: any) => (
        <div key={task.task_uuid} className="p-3 border rounded bg-muted/20">
          <div className="font-medium">{task.title}</div>
          <div className="text-xs text-muted-foreground">
            {task.status ?? "pending"}
          </div>
        </div>
      ))}
    </div>
  );
}
