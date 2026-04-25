"use server";

import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { taskSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createTask(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = taskSchema.parse(data);
  const taskId = crypto.randomUUID();

  const task = {
    id: taskId,
    ...validated,
    reporterId: session.user.id,
    workspaceId: data.workspaceId,
    createdAt: new Date().toISOString(),
  };

  // Store task
  await redis.set(`task:${taskId}`, task);
  // Index task by project
  await redis.sadd(`project:${data.projectId}:tasks`, taskId);

  revalidatePath("/board");
  return task;
}

export async function updateTaskColumn(taskId: string, newColumnId: string, newOrder: number) {
  const task = await redis.get(`task:${taskId}`);
  if (!task) throw new Error("Task not found");

  const updatedTask = { ...(task as any), columnId: newColumnId, order: newOrder };

  await redis.set(`task:${taskId}`, updatedTask);
  return updatedTask;
}

export async function getProjectTasks(projectId: string) {
  const taskIds = await redis.smembers(`project:${projectId}:tasks`);
  const tasks = [];

  for (const id of taskIds) {
    const task = await redis.get(`task:${id}`);
    if (task) tasks.push(task as any);
  }

  return tasks.sort((a, b) => a.order - b.order);
}
