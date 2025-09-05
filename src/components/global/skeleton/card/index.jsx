"use client";

import React from "react";
import { Download } from "lucide-react";

export function SkeletonCard() {
  return (
    <div
      className="group relative overflow-hidden rounded-md bg-muted/40 shadow-sm"
      role="status"
    >
      <div className="w-full p-2 aspect-[4/3] relative">
        <div className="absolute inset-0 h-full w-full bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-md" />

        <div className="absolute top-3 right-3 p-2 rounded-full bg-gray-300 dark:bg-neutral-700 shadow-md opacity-70">
          <Download className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="p-3 space-y-2 bg-background">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
