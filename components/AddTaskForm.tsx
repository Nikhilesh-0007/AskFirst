"use client";

import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Priority } from "../types";
import { Calendar, Plus } from "lucide-react";

export default function AddTaskForm() {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, priority || "Medium", dueDate);
    setTitle("");
    setPriority("");
    setDueDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm mb-6 space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <div className="relative flex-1 md:w-36">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full h-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 cursor-pointer appearance-none"
            >
              <option value="" disabled>Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          <div className="relative flex-1 md:w-44 flex items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 cursor-pointer"
            />
            <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-55 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </form>
  );
}
