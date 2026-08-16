import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive" | "glow";
}

export function GlassCard({
  children,
  className,
  variant = "default",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-[#13151D] border border-white/[0.08]",
    subtle: "bg-white/[0.02] border border-white/[0.05]",
    interactive:
      "bg-[#13151D] border border-white/[0.08] hover:border-white/[0.18] transition-colors cursor-pointer",
    glow: "bg-[#13151D] border border-white/[0.08]",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
