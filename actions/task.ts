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
  await redis.set(`task:${taskId}`, JSON.stringify(task));
  // Index task by project
  await redis.sadd(`project:${data.projectId}:tasks`, taskId);

  revalidatePath("/board");
  return task;
}

export async function updateTaskColumn(taskId: string, newColumnId: string, newOrder: number) {
  const taskStr = await redis.get(`task:${taskId}`);
  if (!taskStr) throw new Error("Task not found");

  const task = JSON.parse(taskStr);
  task.columnId = newColumnId;
  task.order = newOrder;

  await redis.set(`task:${taskId}`, JSON.stringify(task));
  return task;
}

export async function getProjectTasks(projectId: string) {
  const taskIds = await redis.smembers(`project:${projectId}:tasks`);
  const tasks = [];

  for (const id of taskIds) {
    const taskStr = await redis.get(`task:${id}`);
    if (taskStr) tasks.push(JSON.parse(taskStr));
  }

  return tasks.sort((a, b) => a.order - b.order);
}
