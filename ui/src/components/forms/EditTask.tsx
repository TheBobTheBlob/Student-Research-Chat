import { useState } from 'react';
import { useUpdateTask } from '@/hooks/use-task_update';
import type { TaskRow } from '@/components/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditTaskProps {
  task: TaskRow;
  onClose: () => void;
}

export const EditTask = ({ task, onClose }: EditTaskProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [priority, setPriority] = useState(task.priority || '');
  const [status, setStatus] = useState(task.status || '');
  const [assignee, setAssignee] = useState(task.assignee || '');

  const updateTask = useUpdateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTask.mutateAsync({
        task_uuid: task.task_uuid,
        title,
        description,
        due_date: dueDate,
        priority,
        status,
        assignee,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  const fieldClass = 'border border-black px-2 py-1 rounded';

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        color: 'black',
      }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className={fieldClass}
      />

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className={fieldClass}
      />

      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date"
        className={fieldClass}
      />

      <Input
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        placeholder="Priority"
        className={fieldClass}
      />

      <Input
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="Status"
        className={fieldClass}
      />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={updateTask.isLoading}>
          {updateTask.isLoading ? 'Updating...' : 'Update'}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>

      {updateTask.isError && (
        <p style={{ color: 'red' }}>
          {(updateTask.error as any)?.detail || 'Failed to update task'}
        </p>
      )}
    </form>
  );
};
