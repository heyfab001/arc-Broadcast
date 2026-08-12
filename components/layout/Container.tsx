import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  children,
  className,
  size = "xl",
  ...props
}: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] py-6 px-4 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Arc Broadcast Payment</span>
          <span>&bull;</span>
          <span>Arc Ecosystem Protocol</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
          <span>Chain ID: 5042002</span>
          <span>&bull;</span>
          <a
            href="https://testnet.arcscan.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-arc-400 transition-colors"
          >
            Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}
