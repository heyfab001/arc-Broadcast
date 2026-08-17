import React from "react";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment";
import { CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";

export interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config: Record<
    PaymentStatus,
    { label: string; bg: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "Pending",
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    submitted: {
      label: "Submitted",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    confirmed: {
      label: "Confirmed",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    claimed: {
      label: "Claimed",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    available: {
      label: "Ready to claim",
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    expired: {
      label: "Expired",
      bg: "bg-gray-100 text-gray-700 border-gray-300",
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />,
    },
    refunded: {
      label: "Refunded",
      bg: "bg-gray-100 text-gray-700 border-gray-300",
      icon: <RotateCcw className="w-3.5 h-3.5 text-gray-500 shrink-0" />,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-gray-100 text-gray-700 border-gray-300",
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />,
    },
    failed: {
      label: "Failed",
      bg: "bg-red-50 text-red-800 border-red-200",
      icon: <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border",
        current.bg,
        className
      )}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
