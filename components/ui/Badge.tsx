import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "arc" | "outline" | "success" | "warning";
  size?: "sm" | "md";
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-white/10",
    arc: "bg-arc-500/15 text-arc-300 border-arc-500/30",
    outline: "bg-transparent text-slate-400 border-white/15",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
