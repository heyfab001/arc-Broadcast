import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftAddon, rightAddon, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 z-10 flex items-center pointer-events-none text-slate-400">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-11 bg-[#090C15] border border-white/[0.08] rounded-xl px-3.5 text-sm text-white placeholder-slate-500 font-sans transition-all duration-200 outline-none",
              "focus:border-arc-500 focus:ring-1 focus:ring-arc-500/30 focus:bg-[#0C101D]",
              "hover:border-white/15",
              leftAddon && "pl-10",
              rightAddon && "pr-10",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              disabled && "opacity-50 cursor-not-allowed bg-slate-900/50",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 z-10 flex items-center text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
