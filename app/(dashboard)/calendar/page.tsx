import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { TaskCalendar } from "@/components/dashboard/TaskCalendar";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch all tasks for demo
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Visualize your task deadlines and schedules.</p>
        </div>
      </div>
      
      <TaskCalendar tasks={tasks} />
    </div>
  );
}
