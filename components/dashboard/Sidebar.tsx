"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Kanban, ListTodo, Calendar, BarChart2, Settings, ChevronLeft, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

import { CreateProjectModal } from "./CreateProjectModal";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Kanban, label: "Board", href: "/board" },
  { icon: ListTodo, label: "List", href: "/list" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <aside className={cn(
      "relative flex flex-col border-r bg-white dark:bg-zinc-900 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center px-4 border-b">
        {!collapsed && <span className="text-xl font-bold tracking-tight">MOTION</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
              pathname.startsWith(item.href) ? "bg-zinc-100 text-primary dark:bg-zinc-800" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>

        {!collapsed && (
          <Button 
            className="w-full justify-start gap-2" 
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
        {collapsed && (
          <Button 
            size="icon" 
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 border-t text-[10px] text-muted-foreground text-center">
        {!collapsed ? (
          <p>Created by <span className="font-bold text-foreground">RAPTR MAAZ</span><br/>All rights reserved BY MAAZ</p>
        ) : (
          <p>© MAAZ</p>
        )}
      </div>

      <CreateProjectModal
        workspaceId="default" // This should be fetched from session or state
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </aside>
  );
}
