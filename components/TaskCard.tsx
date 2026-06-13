"use client";

import React, { useState, useRef, useEffect } from "react";
import { Task } from "../types";
import { useTaskStore } from "../store/taskStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Check, Edit3, GripVertical, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  isSortableDisabled: boolean;
}

export default function TaskCard({ task, isSortableDisabled }: TaskCardProps) {
  const { toggleDone, editTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isSortableDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      editTask(task.id, editTitle);
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  // Check if task is overdue
  const todayStr = new Date().toISOString().split("T")[0];
  const isTaskOverdue =
    task.status === "pending" && task.dueDate && task.dueDate < todayStr;

  // Priority color badges
  const priorityStyles = {
    Low: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
    Medium:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
    High: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30",
  };

  // Format due date for display
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border ${
        task.status === "done"
          ? "border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20"
          : "border-slate-150 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800"
      } rounded-2xl shadow-sm transition-all duration-250`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Drag Handle */}
        {!isSortableDisabled && (
          <button
            {...attributes}
            {...listeners}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

        {/* Checkbox */}
        <button
          onClick={() => toggleDone(task.id)}
          className={`flex items-center justify-center w-5.5 h-5.5 rounded-full border transition-all cursor-pointer ${
            task.status === "done"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-600 text-transparent"
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 pr-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-indigo-500 dark:border-indigo-600 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <span
                onClick={() => setIsEditing(true)}
                className={`text-[15px] font-medium leading-snug cursor-pointer break-words flex items-center gap-1.5 ${
                  task.status === "done"
                    ? "line-through text-slate-400 dark:text-slate-500"
                    : "text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {task.title}
                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity inline" />
              </span>

              {/* Badges / Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${
                    priorityStyles[task.priority]
                  }`}
                >
                  {task.priority}
                </span>

                {task.dueDate && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </span>
                )}

                {isTaskOverdue && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 animate-pulse uppercase tracking-wider">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Action */}
      <button
        onClick={() => deleteTask(task.id)}
        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
