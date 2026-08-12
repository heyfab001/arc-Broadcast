"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  maxBalance?: number;
  symbol?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  maxBalance,
  symbol = "USDC",
  placeholder = "0.00",
  error,
  disabled = false,
  className,
}: AmountInputProps) {
  const handleMax = () => {
    if (maxBalance !== undefined && maxBalance > 0) {
      onChange(maxBalance.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty or numeric with decimal
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 bg-[#090C16] border border-white/[0.08] rounded-xl pl-3.5 pr-20 text-sm font-mono text-white placeholder-slate-500 transition-all duration-200 outline-none",
            "focus:border-arc-500 focus:ring-1 focus:ring-arc-500/30 focus:bg-[#0C101E]",
            "hover:border-white/15",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          {maxBalance !== undefined && (
            <button
              type="button"
              onClick={handleMax}
              disabled={disabled}
              className="px-2 py-1 text-[11px] font-semibold rounded-md bg-arc-500/15 hover:bg-arc-500/25 text-arc-400 border border-arc-500/30 transition-all uppercase tracking-wider disabled:opacity-50"
            >
              Max
            </button>
          )}
          <span className="text-xs font-semibold text-slate-400 pr-1">{symbol}</span>
        </div>
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
