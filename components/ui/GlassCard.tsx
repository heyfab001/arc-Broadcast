import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive" | "flat";
}

export function GlassCard({
  children,
  className,
  variant = "default",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-white border border-gray-200 shadow-card",
    subtle: "bg-gray-50 border border-gray-200",
    interactive:
      "bg-white border border-gray-200 hover:border-gray-300 shadow-card hover:shadow-md transition-all duration-150 cursor-pointer",
    flat: "bg-white border border-gray-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 sm:p-6",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
