"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

export default function StatsDashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    );
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pending = total - done;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Task Overview
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 rounded-xl">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/30 dark:border-amber-900/30 rounded-xl">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <Circle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{pending}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/30 rounded-xl">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{done}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Progress Bar</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{percentage}% Done</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
