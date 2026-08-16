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
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full h-9 bg-[#0C0D12] border border-white/10 rounded-lg pl-3 pr-16 text-xs font-mono text-white placeholder-slate-600 transition-colors outline-none",
            "focus:border-blue-500",
            error && "border-red-500/50 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          {maxBalance !== undefined && (
            <button
              type="button"
              onClick={handleMax}
              disabled={disabled}
              className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors disabled:opacity-50"
            >
              Max
            </button>
          )}
          <span className="text-[11px] font-medium text-slate-500 pr-1">{symbol}</span>
        </div>
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
