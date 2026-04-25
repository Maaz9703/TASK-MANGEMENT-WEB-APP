export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and workspace preferences.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium">Coming Soon</span>
              <p className="text-sm text-muted-foreground">Profile editing, email notifications, and password management will be available here.</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold mb-4">Workspace Settings</h3>
          <p className="text-sm text-muted-foreground">Workspace branding, member management, and integration settings are currently in development.</p>
        </div>
      </div>
    </div>
  );
}
