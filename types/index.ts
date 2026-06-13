export type Priority = "Low" | "Medium" | "High";
export type Filter = "All" | "Pending" | "Done";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: "pending" | "done";
  createdAt: number;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
}
