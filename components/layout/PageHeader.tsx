import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] mb-8",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-arc-500/15 text-arc-300 border border-arc-500/30">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
