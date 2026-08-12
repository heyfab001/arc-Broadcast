import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "glow" | "interactive";
  glowColor?: "blue" | "purple" | "cyan";
}

export function GlassCard({
  children,
  className,
  variant = "default",
  glowColor = "blue",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-[#0B0E17]/80 backdrop-blur-xl border border-white/[0.08] shadow-card-glass",
    subtle: "bg-white/[0.02] backdrop-blur-md border border-white/[0.05]",
    glow: cn(
      "bg-[#0D1220]/90 backdrop-blur-xl border shadow-card-glass relative",
      glowColor === "blue" && "border-arc-500/30 shadow-arc-glow",
      glowColor === "purple" && "border-arc-purple/30 shadow-arc-glow-lg",
      glowColor === "cyan" && "border-arc-cyan/30 shadow-[0_0_30px_-5px_rgba(0,245,212,0.25)]"
    ),
    interactive:
      "bg-[#0B0E17]/80 backdrop-blur-xl border border-white/[0.08] shadow-card-glass hover:border-arc-500/40 hover:bg-[#0F1424]/90 transition-all duration-300 hover:shadow-arc-glow cursor-pointer",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
