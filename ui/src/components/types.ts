export interface AppSidebarChatButton {
    chat_name: string
    chat_uuid: string
    created_at: string
}

export interface TaskRow {
    task_uuid: string
    chat_uuid?: string
    creator_uuid: string
    assignee_uuid?: string
    title: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
    created_at?: string
}

export interface AnnouncementRow {
    announcement_uuid: string
    chat_uuid: string
    title: string
    content: string
    created_at: string
    status: "unread" | "read"
}

export interface TaskUpdateRequest {
    task_uuid: string
    title?: string
    description?: string
    assignee_uuid?: string
    status?: "to_do" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    due_date?: string // ISO date string
}
