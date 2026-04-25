export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your team's performance and project progress.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completion Rate", value: "84%", change: "+12%" },
          { label: "Active Tasks", value: "24", change: "-2" },
          { label: "Team Velocity", value: "32 pts", change: "+5 pts" },
          { label: "Overdue", value: "3", change: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h4 className="text-2xl font-bold">{stat.value}</h4>
              <span className="text-xs font-medium text-green-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-20 border-dashed flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground italic">
          [Interactive Charts Placeholder]
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Analytics engine is warming up</h3>
          <p className="text-sm text-muted-foreground max-w-xs">Detailed burndown charts and productivity metrics will be available once more data is collected.</p>
        </div>
      </div>
    </div>
  );
}
