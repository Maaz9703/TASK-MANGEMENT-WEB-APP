import { auth } from "@/lib/auth";
import { getUserTasks } from "@/lib/data";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";

const STATUS = [
  ["BACKLOG", "Backlog"], ["TODO", "To Do"], ["IN_PROGRESS", "In Progress"], ["IN_REVIEW", "In Review"], ["DONE", "Done"],
] as const;
const PRIORITY = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks = await getUserTasks(session.user.id);
  const now = Date.now();
  const done = tasks.filter((t) => t.status === "DONE");
  const open = tasks.filter((t) => t.status !== "DONE");
  const overdue = open.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < now);
  const completion = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;

  // Created vs completed over the last 7 days.
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * 86400000);
    return { key: d.toISOString().slice(0, 10), name: d.toLocaleDateString("en-GB", { weekday: "short" }) };
  });
  const trend = days.map(({ key, name }) => ({
    name,
    created: tasks.filter((t) => t.createdAt?.slice(0, 10) === key).length,
    completed: done.filter((t) => t.completedAt?.slice(0, 10) === key).length,
  }));
  const byStatus = STATUS.map(([value, name]) => ({ name, count: tasks.filter((t) => t.status === value).length }));
  const byPriority = PRIORITY.map((p) => ({ name: p.charAt(0) + p.slice(1).toLowerCase(), count: open.filter((t) => t.priority === p).length }));

  const stats = [
    { label: "Completion rate", value: `${completion}%` },
    { label: "Open tasks", value: open.length },
    { label: "Completed (7 days)", value: trend.reduce((s, d) => s + d.completed, 0) },
    { label: "Overdue", value: overdue.length, warn: overdue.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Progress across all of your projects.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-900 p-5">
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
            <h4 className={`text-2xl font-bold mt-2 ${s.warn ? "text-red-500" : ""}`}>{s.value}</h4>
          </div>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-12 text-center text-muted-foreground">
          Create some tasks on your board to see analytics here.
        </div>
      ) : (
        <AnalyticsCharts trend={trend} byStatus={byStatus} byPriority={byPriority} />
      )}
    </div>
  );
}
