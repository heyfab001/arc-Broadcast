import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
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
      sm: "h-8 px-2.5 text-xs rounded-lg gap-1.5",
      md: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      lg: "h-10 px-4 text-sm rounded-lg gap-2",
      icon: "h-8 w-8 p-0 rounded-lg justify-center",
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-none active:scale-[0.99]",
      secondary:
        "bg-[#1A1D27] hover:bg-[#222634] text-white border border-white/10 active:scale-[0.99]",
      outline:
        "bg-transparent border border-white/10 text-slate-200 hover:bg-white/[0.04] active:scale-[0.99]",
      ghost:
        "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.04] active:scale-[0.99]",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.99]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
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
