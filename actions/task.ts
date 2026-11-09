"use server";

import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { getOwnedProject, getOwnedTask, getProjectTasksFor, STATUS_BY_COLUMN, type Column, type Task } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

const createTaskInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  projectId: z.string(),
  columnId: z.string(),
  dueDate: z.string().optional(),
});

function revalidateViews() {
  for (const path of ["/board", "/list", "/calendar", "/dashboard", "/analytics"]) revalidatePath(path);
}

export async function createTask(data: unknown) {
  const userId = await requireUserId();
  const input = createTaskInput.parse(data);
  if (!(await getOwnedProject(input.projectId, userId))) throw new Error("Project not found");
  const column = await redis.get<Column>(`column:${input.columnId}`);
  if (!column || column.projectId !== input.projectId) throw new Error("Column not found");

  const existing = await getProjectTasksFor(input.projectId);
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: STATUS_BY_COLUMN[column.name] ?? "TODO",
    projectId: input.projectId,
    columnId: input.columnId,
    order: existing.filter((t) => t.columnId === input.columnId).length,
    dueDate: input.dueDate,
    reporterId: userId,
    createdAt: new Date().toISOString(),
  };
  await redis.set(`task:${task.id}`, task);
  await redis.sadd(`project:${input.projectId}:tasks`, task.id);
  revalidateViews();
  return task;
}

export async function updateTaskColumn(taskId: string, newColumnId: string, newOrder: number) {
  const userId = await requireUserId();
  const task = await getOwnedTask(taskId, userId);
  if (!task) throw new Error("Task not found");
  const column = await redis.get<Column>(`column:${newColumnId}`);
  if (!column || column.projectId !== task.projectId) throw new Error("Column not found");

  const status = STATUS_BY_COLUMN[column.name] ?? task.status;
  const updated: Task = {
    ...task, columnId: newColumnId, order: newOrder, status,
    completedAt: status === "DONE" ? (task.completedAt ?? new Date().toISOString()) : undefined,
  };
  await redis.set(`task:${taskId}`, updated);
  revalidateViews();
  return updated;
}

const updateTaskInput = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().nullable().optional(),
}).passthrough();

export async function updateTask(taskId: string, updates: unknown) {
  const userId = await requireUserId();
  const task = await getOwnedTask(taskId, userId);
  if (!task) throw new Error("Task not found");
  // Only allow editing content fields; ownership/placement can't be changed here.
  const { title, description, priority, dueDate } = updateTaskInput.parse(updates);
  const updated: Task = {
    ...task,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate: dueDate ?? undefined }),
  };
  await redis.set(`task:${taskId}`, updated);
  revalidateViews();
  return updated;
}

export async function deleteTask(taskId: string) {
  const userId = await requireUserId();
  const task = await getOwnedTask(taskId, userId);
  if (!task) throw new Error("Task not found");
  await redis.del(`task:${taskId}`);
  await redis.srem(`project:${task.projectId}:tasks`, taskId);
  revalidateViews();
}

export async function getProjectTasks(projectId: string) {
  const userId = await requireUserId();
  if (!(await getOwnedProject(projectId, userId))) return [];
  return getProjectTasksFor(projectId);
}
