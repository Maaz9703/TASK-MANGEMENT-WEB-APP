import { IUser } from "@/lib/models/User";
import { IWorkspace } from "@/lib/models/Workspace";
import { IProject } from "@/lib/models/Project";
import { ITask } from "@/lib/models/Task";

export type { IUser, IWorkspace, IProject, ITask };

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    total?: number;
  };
}
