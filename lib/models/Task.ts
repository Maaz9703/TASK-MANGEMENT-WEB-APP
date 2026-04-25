export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string;
  projectId: string;
  columnId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
