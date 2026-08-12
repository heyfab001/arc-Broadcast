import React from "react";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment";
import { CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export interface StatusBadgeProps {
  status: PaymentStatus | "available" | "active";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    confirmed: {
      label: "Confirmed",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    claimed: {
      label: "Claimed",
      bg: "bg-arc-500/10",
      text: "text-arc-400",
      border: "border-arc-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    available: {
      label: "Available",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    refunded: {
      label: "Refunded",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    pending: {
      label: "Pending",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    submitted: {
      label: "Processing",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    failed: {
      label: "Failed",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    expired: {
      label: "Expired",
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
