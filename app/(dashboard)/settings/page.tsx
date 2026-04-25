import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and workspace preferences.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <p className="text-sm text-muted-foreground">Update your personal details here.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Test User" className="max-w-md" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="user@example.com" className="max-w-md" />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Irreversible actions for your account.</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
