import React from "react";
import { cn } from "@/lib/utils";
import { Inbox, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/[0.08] bg-[#0B0E17]/40",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="mt-5"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-8 h-8 text-arc-500 animate-spin mb-3" />
      <p className="text-xs text-slate-400 font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-500/20 bg-red-500/[0.03]">
      <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      {message && <p className="text-xs text-red-300/80 mt-1 max-w-sm">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
