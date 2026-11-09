import { auth } from "@/lib/auth";
import { getUserTasks } from "@/lib/data";
import { TaskCalendar } from "@/components/dashboard/TaskCalendar";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks: any[] = await getUserTasks(session.user.id);

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
