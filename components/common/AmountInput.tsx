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
  const numValue = parseFloat(value) || 0;
  const isInsufficient = maxBalance !== undefined && maxBalance > 0 && numValue > maxBalance;

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

  const displayError = error || (isInsufficient ? "Not enough USDC" : undefined);

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
            "w-full h-12 bg-[#0C0D12] border rounded-lg pl-4 pr-20 text-base font-mono text-white placeholder-slate-500 placeholder:text-base transition-colors outline-none",
            displayError
              ? "border-red-500/60 focus:border-red-500"
              : "border-white/15 focus:border-blue-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div className="absolute right-3 flex items-center gap-2">
          {maxBalance !== undefined && maxBalance > 0 && (
            <button
              type="button"
              onClick={handleMax}
              disabled={disabled}
              className="px-2 py-1 text-xs font-semibold rounded bg-white/[0.09] hover:bg-white/[0.16] text-slate-200 transition-colors disabled:opacity-50"
            >
              Max
            </button>
          )}
          <span className="text-sm font-semibold text-slate-300 pr-1">{symbol}</span>
        </div>
      </div>
      {displayError && <p className="text-xs text-red-400 pl-0.5">{displayError}</p>}
    </div>
  );
}
