"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { updateTaskColumn } from "@/actions/task";
import { useStore } from "@/store/useStore";

import { TaskDetailModal } from "@/components/board/TaskDetailModal";

interface KanbanBoardProps {
  initialColumns: any[];
  initialTasks: any[];
  projectId: string;
  workspaceId: string;
}

export function KanbanBoard({ initialColumns, initialTasks, projectId, workspaceId }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

  const handleUpdateTask = async (updates: any) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...updates } : t));
    // In a real app, call a server action here
    // await updateTask(selectedTask.id, updates);
  };

  const handleDeleteTask = async () => {
    setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
    setSelectedTask(null);
    // await deleteTask(selectedTask.id);
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t: any) => t.id === active.id);
    setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = tasks.some((t: any) => t.id === activeId);
    const isOverATask = tasks.some((t: any) => t.id === overId);

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks: any[]) => {
        const activeIndex = tasks.findIndex((t: any) => t.id === activeId);
        const overIndex = tasks.findIndex((t: any) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const updatedTasks = [...tasks];
          updatedTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(updatedTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = columns.some((col: any) => col.id === overId);

    // Dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks: any[]) => {
        const activeIndex = tasks.findIndex((t: any) => t.id === activeId);
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex].columnId = overId as string;
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t: any) => t.id === taskId);
    if (!task) return;

    // Persist to DB
    await updateTaskColumn(taskId, task.columnId, task.order);
    
    setActiveTask(null);
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 h-full min-h-[500px]">
          <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={tasks.filter((t: any) => t.columnId === col.id)}
                onTaskClick={handleTaskClick}
                projectId={projectId}
                workspaceId={workspaceId}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
