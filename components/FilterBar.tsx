"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Filter } from "../types";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

export default function FilterBar() {
  const activeFilter = useTaskStore((state) => state.activeFilter);
  const setFilter = useTaskStore((state) => state.setFilter);
  const sortByPriority = useTaskStore((state) => state.sortByPriority);
  const togglePrioritySort = useTaskStore((state) => state.togglePrioritySort);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm mb-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  const filters: Filter[] = ["All", "Pending", "Done"];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm mb-6 transition-all duration-300">
      <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl w-full sm:w-auto">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setFilter(filter)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <button
        onClick={togglePrioritySort}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
          sortByPriority
            ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
        }`}
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{sortByPriority ? "Priority Order" : "Manual Order"}</span>
      </button>
    </div>
  );
}
