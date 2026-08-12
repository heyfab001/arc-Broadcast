import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0 rounded-xl justify-center",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-arc-600 to-arc-violet text-white font-medium shadow-lg shadow-arc-600/25 hover:shadow-arc-glow hover:brightness-110 active:scale-[0.98] border border-white/10",
      secondary:
        "bg-surface-100/80 hover:bg-surface-50 text-slate-200 border border-white/[0.08] hover:border-white/20 active:scale-[0.98]",
      outline:
        "bg-transparent border border-white/15 text-slate-200 hover:bg-white/[0.05] hover:border-white/30 active:scale-[0.98]",
      ghost:
        "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98]",
      glow: "bg-arc-600 text-white shadow-arc-glow hover:shadow-arc-glow-lg hover:bg-arc-500 active:scale-[0.98] border border-arc-400/40",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-arc-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
