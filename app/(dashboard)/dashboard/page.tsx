import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch real counts from Redis
  const projectKeys = await redis.keys("project:*");
  const validProjectKeys = projectKeys.filter(key => key.startsWith("project:") && key.split(":").length === 2);
  const totalProjects = validProjectKeys.length;

  const taskKeys = await redis.keys("task:*");
  let tasksInProgress = 0;
  let tasksCompleted = 0;

  for (const key of taskKeys) {
    try {
      const data = await redis.get(key) as any;
      if (data && data.status) {
        if (data.status === "DONE") tasksCompleted++;
        else if (data.status === "IN_PROGRESS") tasksInProgress++;
      }
    } catch (e) {
      continue;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">{totalProjects}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Tasks in Progress</h3>
          <p className="text-3xl font-bold">{tasksInProgress}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold text-green-500">{tasksCompleted}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        {tasksCompleted + tasksInProgress === 0 ? (
          <p className="text-sm text-muted-foreground italic">No recent activity. Start moving tasks!</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">R</div>
              <div className="flex-1">
                <p><span className="font-medium">System</span> detected <span className="font-bold">{tasksCompleted + tasksInProgress}</span> active task operations.</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
