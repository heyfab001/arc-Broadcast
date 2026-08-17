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
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    claimed: {
      label: "Claimed",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    available: {
      label: "Available",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    refunded: {
      label: "Refunded",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    },
    pending: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    submitted: {
      label: "Processing",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    failed: {
      label: "Failed",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
    expired: {
      label: "Expired",
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
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
