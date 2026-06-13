"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import StatsDashboard from "../components/StatsDashboard";
import AddTaskForm from "../components/AddTaskForm";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";
import UndoToast from "../components/UndoToast";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme and mount state
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-mode") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to dark mode
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme-mode", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const pendingCount = mounted ? tasks.filter((t) => t.status === "pending").length : 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 pt-12 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                  Task Manager
                </h1>
                {mounted && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-300 rounded-full border border-indigo-200/30 dark:border-indigo-900/30">
                    {pendingCount} active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Organize and prioritize your daily workflow
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl shadow-sm text-slate-650 dark:text-slate-350 hover:text-indigo-650 dark:hover:text-indigo-400 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </header>

        {/* Dashboard Stats */}
        <StatsDashboard />

        {/* Action Panel */}
        <AddTaskForm />

        {/* Filters */}
        <FilterBar />

        {/* List Section */}
        <TaskList />
      </div>

      {/* Undo Delete Toast */}
      <UndoToast />
    </main>
  );
}
