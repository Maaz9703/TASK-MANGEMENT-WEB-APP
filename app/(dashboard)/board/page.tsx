import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProjects, getProjectColumnsFor, getProjectTasksFor } from "@/lib/data";
import { KanbanBoard } from "@/components/board/KanbanBoard";

export default async function BoardPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { project: requested } = await searchParams;
  const projects = await getUserProjects(session.user.id);
  const project = projects.find((p) => p.id === requested) ?? projects[0];

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <h1 className="text-2xl font-bold">No projects yet</h1>
        <p className="text-muted-foreground">Use “New Project” in the sidebar to create your first board.</p>
      </div>
    );
  }

  const [columns, tasks] = await Promise.all([getProjectColumnsFor(project.id), getProjectTasksFor(project.id)]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || "Drag tasks between columns to update their status."}</p>
        </div>
        {projects.length > 1 && (
          <nav aria-label="Projects" className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/board?project=${p.id}`}
                aria-current={p.id === project.id ? "page" : undefined}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${p.id === project.id ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
              >
                {p.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <KanbanBoard
        key={project.id}
        initialColumns={columns}
        initialTasks={tasks}
        projectId={project.id}
        workspaceId={project.workspaceId}
      />
    </div>
  );
}
