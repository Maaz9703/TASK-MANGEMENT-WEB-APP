"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "@/components/board/TaskCard";
import { MoreVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";

import { CreateTaskModal } from "@/components/board/CreateTaskModal";
import { useState } from "react";

interface BoardColumnProps {
  column: any;
  tasks: any[];
  onTaskClick: (task: any) => void;
  projectId: string;
  workspaceId: string;
}

export function BoardColumn({ column, tasks, onTaskClick, projectId, workspaceId }: BoardColumnProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col w-[300px] shrink-0 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
    >
      {/* Header */}
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-4 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm uppercase tracking-wider">{column.name}</h2>
          <span className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold text-muted-foreground shadow-sm">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto min-h-[150px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>

      {/* Footer */}
      <div className="p-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" 
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <CreateTaskModal
        projectId={projectId}
        workspaceId={workspaceId}
        columnId={column.id}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(task) => {
          // Task will be added via revalidation or optimistic update in parent
        }}
      />
    </div>
  );
}
