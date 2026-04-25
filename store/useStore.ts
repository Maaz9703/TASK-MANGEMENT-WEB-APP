import { create } from 'zustand';

interface AppState {
  activeWorkspaceId: string | null;
  activeProjectId: string | null;
  tasks: any[];
  columns: any[];
  setWorkspace: (id: string) => void;
  setProject: (id: string) => void;
  setTasks: (tasks: any[]) => void;
  setColumns: (columns: any[]) => void;
  updateTaskOptimistic: (taskId: string, updates: any) => void;
}

export const useStore = create<AppState>((set) => ({
  activeWorkspaceId: null,
  activeProjectId: null,
  tasks: [],
  columns: [],
  setWorkspace: (id) => set({ activeWorkspaceId: id }),
  setProject: (id) => set({ activeProjectId: id }),
  setTasks: (tasks) => set({ tasks }),
  setColumns: (columns) => set({ columns }),
  updateTaskOptimistic: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId ? { ...task, ...updates } : task
    ),
  })),
}));
