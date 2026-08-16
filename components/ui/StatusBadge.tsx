import React from "react";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment";

export interface StatusBadgeProps {
  status: PaymentStatus | "available" | "active";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    confirmed: {
      label: "Completed",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    claimed: {
      label: "Claimed",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    available: {
      label: "Available",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    refunded: {
      label: "Refunded",
      bg: "bg-slate-500/10",
      text: "text-slate-300",
      border: "border-slate-500/20",
    },
    pending: {
      label: "Pending",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    submitted: {
      label: "Processing",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    failed: {
      label: "Failed",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
    expired: {
      label: "Expired",
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded text-xs sm:text-sm font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
}
