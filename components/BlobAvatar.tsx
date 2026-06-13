"use client";

import React from "react";

interface BlobAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export default function BlobAvatar({ size = "md" }: BlobAvatarProps) {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const eyeSizeClasses = {
    sm: "w-1 h-2",
    md: "w-2 h-3.5",
    lg: "w-2.5 h-4.5",
    xl: "w-3.5 h-6",
  };

  const eyeSpacingClasses = {
    sm: "gap-1.5",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-blob-morph bg-gradient-to-tr from-blue-605 to-indigo-650 flex items-center justify-center relative shadow-lg shadow-indigo-500/20`}
    >
      <div className={`flex ${eyeSpacingClasses[size]} items-center justify-center`}>
        <div
          className={`${eyeSizeClasses[size]} bg-white rounded-full transition-all duration-300 animate-[bounce_3s_infinite]`}
        />
        <div
          className={`${eyeSizeClasses[size]} bg-white rounded-full transition-all duration-300 animate-[bounce_3s_infinite_0.2s]`}
        />
      </div>
    </div>
  );
}
