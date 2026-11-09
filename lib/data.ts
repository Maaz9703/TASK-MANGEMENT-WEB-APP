import { redis } from "./redis";

// Every project belongs to one user (ownerId) and is indexed under
// `user:{id}:projects`, so users only ever see their own data.

export type Column = { id: string; name: string; order: number; projectId: string };
export type Project = { id: string; name: string; description?: string; workspaceId: string; ownerId: string; color?: string; createdAt: string };
export type Task = {
  id: string; title: string; description?: string; status: string; priority: string;
  projectId: string; columnId: string; order: number; dueDate?: string; createdAt: string; reporterId?: string;
  completedAt?: string;
};

export const STATUS_BY_COLUMN: Record<string, string> = {
  Backlog: "BACKLOG",
  "To Do": "TODO",
  "In Progress": "IN_PROGRESS",
  Review: "IN_REVIEW",
  Done: "DONE",
};

async function getMany<T>(keys: string[]): Promise<T[]> {
  if (keys.length === 0) return [];
  const values = await redis.mget<(T | null)[]>(...keys);
  return values.filter((v): v is T => Boolean(v) && typeof v === "object");
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const ids = await redis.smembers(`user:${userId}:projects`);
  const projects = await getMany<Project>(ids.map((id) => `project:${id}`));
  return projects.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getOwnedProject(projectId: string, userId: string): Promise<Project | null> {
  const project = await redis.get<Project>(`project:${projectId}`);
  return project && project.ownerId === userId ? project : null;
}

export async function getProjectColumnsFor(projectId: string): Promise<Column[]> {
  const ids = await redis.smembers(`project:${projectId}:columns`);
  return (await getMany<Column>(ids.map((id) => `column:${id}`))).sort((a, b) => a.order - b.order);
}

export async function getProjectTasksFor(projectId: string): Promise<Task[]> {
  const ids = await redis.smembers(`project:${projectId}:tasks`);
  return (await getMany<Task>(ids.map((id) => `task:${id}`))).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getUserTasks(userId: string): Promise<(Task & { projectName: string })[]> {
  const projects = await getUserProjects(userId);
  const lists = await Promise.all(projects.map(async (p) => (await getProjectTasksFor(p.id)).map((t) => ({ ...t, projectName: p.name }))));
  return lists.flat();
}

/** Returns the task only if it belongs to one of the user's projects. */
export async function getOwnedTask(taskId: string, userId: string): Promise<Task | null> {
  const task = await redis.get<Task>(`task:${taskId}`);
  if (!task) return null;
  return (await getOwnedProject(task.projectId, userId)) ? task : null;
}

export async function createProjectFor(userId: string, input: { name: string; description?: string; color?: string; workspaceId?: string }) {
  const projectId = crypto.randomUUID();
  const project: Project = {
    id: projectId,
    name: input.name,
    description: input.description,
    color: input.color,
    workspaceId: input.workspaceId || "default",
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };
  const columns: Column[] = ["Backlog", "To Do", "In Progress", "Done"].map((name, order) => ({ id: crypto.randomUUID(), name, order, projectId }));

  const pipe = redis.pipeline();
  pipe.set(`project:${projectId}`, project);
  pipe.sadd(`user:${userId}:projects`, projectId);
  for (const col of columns) {
    pipe.set(`column:${col.id}`, col);
    pipe.sadd(`project:${projectId}:columns`, col.id);
  }
  await pipe.exec();
  return { project, columns };
}

const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString();

/** Gives a new account a realistic starter project so the app never opens empty. */
export async function seedStarterProject(userId: string) {
  const { project, columns } = await createProjectFor(userId, {
    name: "Website Launch",
    description: "Plan, build and ship the new marketing website.",
    color: "#6366f1",
  });
  const col = Object.fromEntries(columns.map((c) => [c.name, c.id]));
  const samples: [string, string, string, number | null, string][] = [
    ["Collect brand assets and copy", "Done", "MEDIUM", -6, "Logos, fonts, product photos and approved headlines."],
    ["Wireframe home and pricing pages", "Done", "HIGH", -3, "Low-fidelity layouts reviewed with the team."],
    ["Build responsive navigation", "In Progress", "HIGH", 1, "Desktop mega-menu and mobile drawer."],
    ["Integrate contact form with email", "In Progress", "MEDIUM", 3, "Validate inputs and send notifications."],
    ["Write SEO meta descriptions", "To Do", "LOW", 5, "Unique titles and descriptions for every page."],
    ["Set up analytics dashboard", "To Do", "MEDIUM", 7, "Track sign-ups and page conversion."],
    ["Performance audit (Lighthouse 90+)", "To Do", "URGENT", 2, "Optimise images and remove unused scripts."],
    ["Blog section", "Backlog", "LOW", null, "Nice to have after launch."],
    ["Dark mode polish", "Backlog", "MEDIUM", null, "Check contrast on all components."],
  ];
  const pipe = redis.pipeline();
  samples.forEach(([title, column, priority, due, description], i) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title, description, priority,
      status: STATUS_BY_COLUMN[column],
      projectId: project.id,
      columnId: col[column],
      order: i,
      dueDate: due === null ? undefined : day(due),
      createdAt: day(-10 + i),
      completedAt: column === "Done" ? day(-5 + i) : undefined,
      reporterId: userId,
    };
    pipe.set(`task:${task.id}`, task);
    pipe.sadd(`project:${project.id}:tasks`, task.id);
  });
  await pipe.exec();
  return project;
}
