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
      sm: "h-10 px-3.5 text-sm font-medium rounded-lg gap-2",
      md: "h-12 px-5 text-base font-medium rounded-lg gap-2",
      lg: "h-13 px-6 text-base font-semibold rounded-lg gap-2.5",
      icon: "h-10 w-10 p-0 rounded-lg justify-center",
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm active:scale-[0.99]",
      secondary:
        "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm active:scale-[0.99]",
      outline:
        "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 active:scale-[0.99]",
      ghost:
        "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.99]",
      danger:
        "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 active:scale-[0.99]",
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
