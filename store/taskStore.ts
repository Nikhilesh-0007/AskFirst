import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { Task, Priority, Filter } from "../types";

interface TaskState {
  tasks: Task[];
  activeFilter: Filter;
  sortByPriority: boolean;
  deletedTask: { task: Task; index: number } | null;

  addTask: (title: string, priority: Priority, dueDate?: string) => void;
  toggleDone: (id: string) => void;
  editTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  clearDeletedTask: () => void;
  setFilter: (filter: Filter) => void;
  togglePrioritySort: () => void;
  reorderTasks: (activeId: string, overId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      activeFilter: "All",
      sortByPriority: false,
      deletedTask: null,

      addTask: (title, priority, dueDate) =>
        set((state) => {
          const newTask: Task = {
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            title: title.trim(),
            priority,
            status: "pending",
            createdAt: Date.now(),
            dueDate: dueDate || undefined,
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      toggleDone: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status: task.status === "pending" ? "done" : "pending" }
              : task
          ),
        })),

      editTask: (id, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, title: title.trim() } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === id);
          if (index === -1) return {};
          const task = state.tasks[index];
          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            deletedTask: { task, index },
          };
        }),

      undoDelete: () =>
        set((state) => {
          if (!state.deletedTask) return {};
          const { task, index } = state.deletedTask;
          const nextTasks = [...state.tasks];
          nextTasks.splice(index, 0, task);
          return {
            tasks: nextTasks,
            deletedTask: null,
          };
        }),

      clearDeletedTask: () => set({ deletedTask: null }),

      setFilter: (filter) => set({ activeFilter: filter }),

      togglePrioritySort: () =>
        set((state) => ({ sortByPriority: !state.sortByPriority })),

      reorderTasks: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
          const newIndex = state.tasks.findIndex((t) => t.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return { tasks: arrayMove(state.tasks, oldIndex, newIndex) };
          }
          return {};
        }),
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        tasks: state.tasks,
        activeFilter: state.activeFilter,
        sortByPriority: state.sortByPriority,
      }),
    }
  )
);
