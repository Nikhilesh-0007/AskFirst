"use client";

import React, { useEffect, useState } from "react";
import { useHealthStore } from "../store/healthStore";
import { X, Heart } from "lucide-react";

interface HealthProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthProfilePanel({ isOpen, onClose }: HealthProfilePanelProps) {
  const { healthProfile, updateProfile } = useHealthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleInputChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Personal Health Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Adding details helps Clary understand your medical profile and tailor symptoms advice.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              value={healthProfile.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Date of Birth (Custom Picker)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={healthProfile.dobDay}
                onChange={(e) => handleInputChange("dobDay", e.target.value)}
                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Day</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={healthProfile.dobMonth}
                onChange={(e) => handleInputChange("dobMonth", e.target.value)}
                className="px-3 py-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={healthProfile.dobYear}
                onChange={(e) => handleInputChange("dobYear", e.target.value)}
                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned Sex at Birth
            </label>
            <select
              value={healthProfile.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weight (kg)
              </label>
              <input
                type="number"
                value={healthProfile.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Height (cm)
              </label>
              <input
                type="number"
                value={healthProfile.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="e.g. 175"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/20">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer text-center"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
