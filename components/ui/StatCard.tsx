import React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  isReadyForLive?: boolean;
  trend?: {
    value: string;
    positive?: boolean;
  };
  glowColor?: "blue" | "purple" | "cyan";
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  isReadyForLive = false,
  trend,
  glowColor = "blue",
  className,
}: StatCardProps) {
  return (
    <GlassCard
      variant="default"
      className={cn(
        "relative overflow-hidden group hover:border-white/15 transition-all duration-300",
        className
      )}
    >
      {/* Background glow on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-arc-500/10 rounded-full blur-2xl group-hover:bg-arc-500/20 transition-all duration-500" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {label}
            </span>
            {isReadyForLive && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-white/5">
                Ready
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
              {value}
            </span>
            {subValue && (
              <span className="text-xs text-slate-400">{subValue}</span>
            )}
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400 group-hover:scale-110 group-hover:border-arc-400/40 group-hover:text-arc-300 transition-all duration-300">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "font-medium",
              trend.positive ? "text-emerald-400" : "text-slate-400"
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </GlassCard>
  );
}
