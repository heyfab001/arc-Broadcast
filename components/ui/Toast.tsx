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
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-arc-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-[#0B1416]/95",
    warning: "border-amber-500/30 bg-[#16120B]/95",
    error: "border-red-500/30 bg-[#160B0B]/95",
    info: "border-arc-500/30 bg-[#0B101E]/95",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white tracking-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
