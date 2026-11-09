import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProjects, getUserTasks } from "@/lib/data";

const PRIORITY_STYLE: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  LOW: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [projects, tasks] = await Promise.all([getUserProjects(session.user.id), getUserTasks(session.user.id)]);
  const done = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "IN_REVIEW").length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const now = Date.now();
  const upcoming = tasks
    .filter((t) => t.status !== "DONE" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 6);

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Open tasks", value: tasks.length - done },
    { label: "In progress", value: inProgress },
    { label: "Completed", value: `${done} · ${completion}%`, accent: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name?.split(" ")[0] || "there"}. Here’s where your work stands.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{s.label}</h3>
            <p className={`text-3xl font-bold ${s.accent ?? ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Upcoming deadlines</h3>
          <Link href="/calendar" className="text-sm text-primary hover:underline">Open calendar</Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing due — add due dates to tasks to see them here.</p>
        ) : (
          <ul className="divide-y">
            {upcoming.map((t) => {
              const due = new Date(t.dueDate!);
              const overdue = due.getTime() < now;
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <span className="font-medium flex-1 min-w-[180px]">{t.title}</span>
                  <span className="text-muted-foreground">{t.projectName}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[t.priority] ?? PRIORITY_STYLE.LOW}`}>{t.priority}</span>
                  <span className={overdue ? "text-red-500 font-medium" : "text-muted-foreground"}>
                    {overdue ? "Overdue · " : ""}{due.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
