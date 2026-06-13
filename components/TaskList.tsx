"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Task } from "../types";
import TaskCard from "./TaskCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const activeFilter = useTaskStore((state) => state.activeFilter);
  const sortByPriority = useTaskStore((state) => state.sortByPriority);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drag when clicking inline edit
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!mounted) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Filter tasks
  let filteredTasks = tasks.filter((task) => {
    if (activeFilter === "Pending") return task.status === "pending";
    if (activeFilter === "Done") return task.status === "done";
    return true;
  });

  // Priority sorting logic
  if (sortByPriority) {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    filteredTasks = [...filteredTasks].sort(
      (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(active.id.toString(), over.id.toString());
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4 text-slate-400 dark:text-slate-500">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No tasks match the filter
        </h3>
        <p className="text-sm text-slate-450 dark:text-slate-500 mt-1 max-w-xs">
          Try changing your filter or add some new tasks to get started.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <TaskCard task={task} isSortableDisabled={sortByPriority} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
