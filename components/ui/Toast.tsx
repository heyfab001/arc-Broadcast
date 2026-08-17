"use client";

import React, { useEffect, useState } from "react";
import { useToast, ToastItem, dismissToast } from "@/hooks/useToast";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, subscribe } = useToast();
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribe();
  }, [subscribe]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white",
    warning: "border-amber-200 bg-white",
    error: "border-red-200 bg-white",
    info: "border-blue-200 bg-white",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-modal transition-all duration-150 transform translate-y-0",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        {toast.message && (
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed break-words">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss toast"
        className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
