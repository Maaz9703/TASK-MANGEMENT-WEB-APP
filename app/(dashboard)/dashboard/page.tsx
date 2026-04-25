export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Tasks in Progress</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Completed this week</h3>
          <p className="text-3xl font-bold text-green-500">48</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 text-sm">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">U</div>
              <div className="flex-1">
                <p><span className="font-medium">User</span> moved <span className="font-medium">Task {i}</span> to <span className="font-medium font-bold">Done</span></p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
