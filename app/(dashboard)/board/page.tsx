import { auth } from "@/lib/auth";
import { getProjectColumns } from "@/actions/project";
import { getProjectTasks } from "@/actions/task";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { redis } from "@/lib/redis";

export default async function BoardPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Find the first available project in Redis for the demo
  const allKeys = await redis.keys("project:*");
  const projectKeys = allKeys.filter(key => key.startsWith("project:") && key.split(":").length === 2);
  let project = null;

  for (const key of projectKeys) {
    try {
      const data = await redis.get(key);
      if (data && typeof data === "object") {
        project = data as any;
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">No projects found</h1>
        <p className="text-muted-foreground">Create a project to start using the board.</p>
      </div>
    );
  }

  const columns = await getProjectColumns(project.id);
  const tasks = await getProjectTasks(project.id);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name} Board</h1>
          <p className="text-muted-foreground">{project.description || "Manage your project tasks here."}</p>
        </div>
      </div>
      
      <KanbanBoard 
        initialColumns={columns} 
        initialTasks={tasks} 
        projectId={project.id}
        workspaceId={project.workspaceId}
      />
    </div>
  );
}
