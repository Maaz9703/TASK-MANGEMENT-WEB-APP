"use server";

import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProject(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = projectSchema.parse(data);
  const projectId = crypto.randomUUID();

  const project = {
    id: projectId,
    ...validated,
    createdAt: new Date().toISOString(),
  };

  // Store project
  await redis.set(`project:${projectId}`, JSON.stringify(project));

  // Create default columns
  const defaultColumns = [
    { id: crypto.randomUUID(), name: "Backlog", order: 0, projectId },
    { id: crypto.randomUUID(), name: "To Do", order: 1, projectId },
    { id: crypto.randomUUID(), name: "In Progress", order: 2, projectId },
    { id: crypto.randomUUID(), name: "Done", order: 3, projectId },
  ];

  for (const col of defaultColumns) {
    await redis.set(`column:${col.id}`, JSON.stringify(col));
    await redis.sadd(`project:${projectId}:columns`, col.id);
  }

  revalidatePath("/board");
  return project;
}

export async function getProjectColumns(projectId: string) {
  const columnIds = await redis.smembers(`project:${projectId}:columns`);
  const columns = [];

  for (const id of columnIds) {
    const colStr = await redis.get(`column:${id}`);
    if (colStr) columns.push(JSON.parse(colStr));
  }

  return columns.sort((a, b) => a.order - b.order);
}
