export default function CalendarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
      <p className="text-muted-foreground">Visualize your task deadlines and schedules.</p>
      <div className="border rounded-xl p-20 bg-white dark:bg-zinc-900 border-dashed flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Calendar View is coming soon</h3>
          <p className="text-sm text-muted-foreground max-w-xs">A comprehensive calendar view to help you track milestones and due dates is on the way.</p>
        </div>
      </div>
    </div>
  );
}
