"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";

export default function UndoToast() {
  const deletedTask = useTaskStore((state) => state.deletedTask);
  const undoDelete = useTaskStore((state) => state.undoDelete);
  const clearDeletedTask = useTaskStore((state) => state.clearDeletedTask);
  const [timeLeft, setTimeLeft] = useState(4000); // 4 seconds in milliseconds

  useEffect(() => {
    if (!deletedTask) return;

    setTimeLeft(4000);
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 4000 - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearDeletedTask();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [deletedTask, clearDeletedTask]);

  if (!deletedTask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col bg-slate-900 dark:bg-slate-950 text-white rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden w-80"
      >
        <div className="flex items-center justify-between p-4 gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400">Deleted Task</p>
            <p className="text-sm font-semibold truncate">
              "{deletedTask.task.title}"
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={undoDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              onClick={clearDeletedTask}
              className="p-1.5 hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Countdown Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-75"
            style={{ width: `${(timeLeft / 4000) * 100}%` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
