"use client";

import { User } from "next-auth";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

export function Topbar({ user }: { user: any }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-zinc-900 px-6 shrink-0">
      <div className="flex w-full max-w-md items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks, projects..." 
            className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          {!mounted && <div className="h-4 w-4" />}
        </Button>
        <div className="flex items-center gap-3 border-l pl-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
