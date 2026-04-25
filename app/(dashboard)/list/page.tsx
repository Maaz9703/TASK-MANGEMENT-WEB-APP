import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

export default async function ListPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch all tasks for demo (in production, filter by project/workspace)
  const taskKeys = await redis.keys("task:*");
  const tasks = [];
  
  for (const key of taskKeys) {
    try {
      const data = await redis.get(key);
      if (data && typeof data === "object") {
        tasks.push(data as any);
      }
    } catch (e) {
      continue;
    }
  }

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
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{task.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {task.status || "TODO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {task.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">
                      {task.assignee?.replace('_', ' ') || "Unassigned"}
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
