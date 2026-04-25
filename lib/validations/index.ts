import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  assigneeId: z.string().optional(),
  projectId: z.string(),
  columnId: z.string(),
  dueDate: z.date().optional(),
});

export const workspaceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export const projectSchema = z.object({
  name: z.string().min(2),
  workspaceId: z.string(),
  color: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
});
