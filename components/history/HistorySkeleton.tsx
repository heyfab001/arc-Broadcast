"use client";

import React from "react";

export function HistorySkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {/* Desktop Skeleton Table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-white/[0.08] bg-[#0C0D12]">
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 px-4 bg-white/[0.01]"
            >
              <div className="h-4 w-32 bg-white/[0.06] rounded" />
              <div className="h-4 w-24 bg-white/[0.04] rounded font-mono" />
              <div className="h-4 w-20 bg-white/[0.06] rounded font-mono" />
              <div className="h-6 w-16 bg-white/[0.06] rounded-md" />
              <div className="h-4 w-24 bg-white/[0.04] rounded" />
              <div className="h-4 w-16 bg-white/[0.06] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton Cards */}
      <div className="sm:hidden space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.08] bg-[#0C0D12] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-white/[0.06] rounded" />
              <div className="h-6 w-16 bg-white/[0.06] rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <div className="h-4 w-20 bg-white/[0.06] rounded" />
              <div className="h-4 w-16 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
