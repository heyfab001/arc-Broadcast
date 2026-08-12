"use client";

import React from "react";

export function HistorySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Skeleton Header hint */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-arc-500 animate-ping" />
          <span className="text-slate-300">Querying Arc Testnet event logs...</span>
        </div>
        <div className="h-3 w-16 bg-white/[0.04] rounded" />
      </div>

      {/* Desktop Skeleton Table */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090C16]">
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 px-5 bg-white/[0.01]"
            >
              {/* Type Icon & Name */}
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-24 bg-white/[0.08] rounded" />
                  <div className="h-2.5 w-16 bg-white/[0.04] rounded" />
                </div>
              </div>

              {/* Status */}
              <div className="w-24">
                <div className="h-6 w-20 bg-white/[0.06] rounded-full" />
              </div>

              {/* Amount */}
              <div className="w-28 space-y-1">
                <div className="h-4 w-20 bg-white/[0.08] rounded" />
              </div>

              {/* Details */}
              <div className="w-24">
                <div className="h-3 w-16 bg-white/[0.05] rounded" />
              </div>

              {/* Timestamp */}
              <div className="w-32">
                <div className="h-3 w-24 bg-white/[0.05] rounded" />
              </div>

              {/* Transaction Hash */}
              <div className="w-20 flex justify-end">
                <div className="h-3 w-16 bg-white/[0.06] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton Cards */}
      <div className="sm:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-white/[0.08] bg-[#090C16] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 bg-white/[0.08] rounded" />
                  <div className="h-2.5 w-14 bg-white/[0.04] rounded" />
                </div>
              </div>
              <div className="h-6 w-18 bg-white/[0.06] rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <div className="h-4 w-20 bg-white/[0.08] rounded" />
              <div className="h-3 w-20 bg-white/[0.05] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
