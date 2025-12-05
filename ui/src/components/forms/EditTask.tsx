import { useState } from "react"
import { useUpdateTask } from "@/hooks/use-task_update"
import type { TaskRow } from "@/components/types"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface EditTaskProps {
  task: TaskRow
  onClose: () => void
}

export function EditTask({ task, onClose }: EditTaskProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [dueDate, setDueDate] = useState(task.due_date || "")
  const [priority, setPriority] = useState(task.priority || "")
  const [status, setStatus] = useState(task.status || "")
  const [assignee, setAssignee] = useState(task.assignee || "")

  const updateTask = useUpdateTask()

  const fieldClass =
    "bg-gray-800 text-white border border-gray-600 placeholder:text-gray-400"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateTask.mutateAsync({
      task_uuid: task.task_uuid,
      title,
      description,
      due_date: dueDate,
      priority,
      status,
      assignee,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-800/80">
      <div className="w-full max-w-lg bg-neutral-900 rounded-lg p-6 text-white border border-neutral-700">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>

              <Field>
                <FieldLabel className="text-white-300">Title</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field>
                <FieldLabel className="text-white-300">Description</FieldLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={fieldClass}
                />
              </Field>

              <Field>
                <FieldLabel className="text-white-300">Due Date</FieldLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field>
                <FieldLabel className="text-white-300">Priority</FieldLabel>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Choose priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 text-white border border-gray-700">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-white-300">Status</FieldLabel>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 text-white border border-gray-700">
                    <SelectItem value="to_do">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

            </FieldGroup>
          </FieldSet>

          <div className="flex gap-3 mt-4">
            <Button type="submit" className="bg-neutral-600 text-white-300 hover:bg-neutral-700">
              {updateTask.isLoading ? "Updating..." : "Update"}
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-600 text-white-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
