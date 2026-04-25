"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Clock, MessageSquare, Paperclip, Flag } from "lucide-react";

interface TaskCardProps {
  task: any;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    LOW: "text-blue-500",
    MEDIUM: "text-yellow-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500",
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 opacity-50"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow border-none dark:bg-zinc-800",
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h3>
      </div>

      <div className="flex flex-wrap gap-1">
        {task.labels?.map((label: any) => (
          <span 
            key={label.name} 
            className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: label.color + '20', color: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Flag className={cn("h-3.5 w-3.5", priorityColors[task.priority as keyof typeof priorityColors])} />
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
        
        <div className="flex items-center -space-x-1.5">
          <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-800 flex items-center justify-center text-[10px] font-bold">
            {task.assigneeId ? "?" : "U"}
          </div>
        </div>
      </div>
    </Card>
  );
}
