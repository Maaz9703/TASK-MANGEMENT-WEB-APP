import { auth } from "@/lib/auth";
import { getUserTasks } from "@/lib/data";

const STATUS_LABEL: Record<string, string> = { BACKLOG: "Backlog", TODO: "To Do", IN_PROGRESS: "In Progress", IN_REVIEW: "In Review", DONE: "Done" };

export default async function ListPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks: any[] = await getUserTasks(session.user.id);

  // Sort by created date descending
  tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">List View</h1>
          <p className="text-muted-foreground">Manage your tasks in a streamlined list format.</p>
        </div>
      </div>
      
      <div className="border rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
        {tasks.length === 0 ? (
           <div className="p-12 text-center text-muted-foreground">
             No tasks found. Create one in the Board view.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Task Title</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Priority</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Due Date</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{task.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {STATUS_LABEL[task.status] || "To Do"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {task.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {task.projectName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
