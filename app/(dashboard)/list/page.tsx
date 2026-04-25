export default function ListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">List View</h1>
      <p className="text-muted-foreground">Manage your tasks in a streamlined list format.</p>
      <div className="border rounded-xl p-20 bg-white dark:bg-zinc-900 border-dashed flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">List View is coming soon</h3>
          <p className="text-sm text-muted-foreground max-w-xs">We're working hard to bring you a powerful list view with advanced filtering and sorting.</p>
        </div>
      </div>
    </div>
  );
}
