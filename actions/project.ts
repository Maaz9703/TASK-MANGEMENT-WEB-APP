"use server";

import { auth } from "@/lib/auth";
import { createProjectFor, getOwnedProject, getProjectColumnsFor } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectInput = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(80),
  description: z.string().max(300).optional(),
  color: z.string().optional(),
  workspaceId: z.string().optional(),
});

export async function createProject(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const input = createProjectInput.parse(data);
  const { project } = await createProjectFor(session.user.id, input);
  revalidatePath("/", "layout");
  return project;
}

export async function getProjectColumns(projectId: string) {
  const session = await auth();
  if (!session?.user?.id || !(await getOwnedProject(projectId, session.user.id))) return [];
  return getProjectColumnsFor(projectId);
}
