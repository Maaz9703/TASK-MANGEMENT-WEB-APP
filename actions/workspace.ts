"use server";

import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { workspaceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createWorkspace(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = workspaceSchema.parse(data);
  const workspaceId = crypto.randomUUID();

  const workspace = {
    id: workspaceId,
    ...validated,
    ownerId: session.user.id,
    members: [{ userId: session.user.id, role: "OWNER", joinedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };

  // Store workspace
  await redis.set(`workspace:${workspaceId}`, JSON.stringify(workspace));
  // Index workspace by user membership
  await redis.sadd(`user:${session.user.id}:workspaces`, workspaceId);

  revalidatePath("/dashboard");
  return workspace;
}

export async function getUserWorkspaces() {
  const session = await auth();
  if (!session?.user) return [];

  const workspaceIds = await redis.smembers(`user:${session.user.id}:workspaces`);
  const workspaces = [];

  for (const id of workspaceIds) {
    const wsStr = await redis.get(`workspace:${id}`);
    if (wsStr) workspaces.push(JSON.parse(wsStr));
  }

  return workspaces;
}
