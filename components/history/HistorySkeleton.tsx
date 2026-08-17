"use client";

import React from "react";

export function HistorySkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {/* Desktop Skeleton Table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 px-4 bg-gray-50/40"
            >
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded font-mono animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded font-mono animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton Cards */}
      <div className="sm:hidden space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 bg-white space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
