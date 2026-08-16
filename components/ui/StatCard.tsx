import React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <GlassCard
      variant="default"
      className={cn("p-4 space-y-2", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="text-slate-500">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-400 font-sans">{subValue}</span>
        )}
      </div>

      {trend && (
        <div className="text-[11px] text-slate-400">
          {trend.value}
        </div>
      )}
    </GlassCard>
  );
}
