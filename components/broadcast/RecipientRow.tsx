"use client";

import React, { useRef, useEffect } from "react";
import { Recipient } from "@/types/payment";
import { Trash2, Check } from "lucide-react";
import { isValidEthereumAddress, isValidAmount } from "@/lib/validation";
import { cn } from "@/lib/utils";

export interface RecipientRowProps {
  index: number;
  recipient: Recipient;
  tokenSymbol: string;
  isDuplicate?: boolean;
  onUpdate: (id: string, field: "address" | "amount", value: string) => void;
  onRemove: (id: string) => void;
  isRemovable: boolean;
  autoFocus?: boolean;
}

export function RecipientRow({
  index,
  recipient,
  tokenSymbol,
  isDuplicate = false,
  onUpdate,
  onRemove,
  isRemovable,
  autoFocus = false,
}: RecipientRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const isAddressFilled = recipient.address.trim() !== "";
  const isAddressValid = isAddressFilled && isValidEthereumAddress(recipient.address) && !isDuplicate;
  const isAddressError = isAddressFilled && (!isValidEthereumAddress(recipient.address) || isDuplicate);

  const isAmountFilled = recipient.amount.trim() !== "";
  const isAmountValid = isAmountFilled && isValidAmount(recipient.amount);
  const isAmountError = isAmountFilled && !isAmountValid;

  const numLabel = (index + 1).toString().padStart(2, "0");

  return (
    <div className="grid grid-cols-12 gap-2.5 items-start py-1.5 transition-all duration-150">
      {/* Index */}
      <div className="col-span-1 flex items-center justify-center h-12">
        <span className="font-mono text-xs sm:text-sm text-slate-500 font-medium">
          {numLabel}
        </span>
      </div>

      {/* Address */}
      <div className="col-span-7 space-y-1">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={recipient.address}
            onChange={(e) => onUpdate(recipient.id, "address", e.target.value)}
            placeholder="Paste wallet address"
            className={cn(
              "w-full h-12 bg-[#0C0D12] border rounded-lg pl-3.5 pr-9 text-base font-mono text-white placeholder-slate-500 placeholder:text-base outline-none transition-colors",
              isAddressError
                ? "border-red-500/60 focus:border-red-500"
                : isAddressValid
                ? "border-emerald-500/50 focus:border-emerald-500"
                : "border-white/15 focus:border-blue-500"
            )}
          />
          {isAddressValid && (
            <Check className="w-4 h-4 text-emerald-400 absolute right-3 top-4 pointer-events-none" />
          )}
        </div>

        {isAddressError && (
          <p className="text-xs sm:text-sm text-red-400 pl-0.5">
            {isDuplicate ? "Duplicate wallet address" : "Enter a valid wallet address"}
          </p>
        )}
        {isAddressValid && (
          <p className="text-xs sm:text-sm text-emerald-400 pl-0.5 flex items-center gap-1">
            <span>✓ Valid address</span>
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="col-span-3 space-y-1">
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={recipient.amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d*$/.test(val)) {
                onUpdate(recipient.id, "amount", val);
              }
            }}
            placeholder="0.00"
            className={cn(
              "w-full h-12 bg-[#0C0D12] border rounded-lg pl-3.5 pr-14 text-base font-mono text-white placeholder-slate-500 placeholder:text-base outline-none transition-colors",
              isAmountError
                ? "border-red-500/60 focus:border-red-500"
                : "border-white/15 focus:border-blue-500"
            )}
          />
          <span className="absolute right-3 top-3.5 text-xs sm:text-sm font-semibold text-slate-400 pointer-events-none">
            {tokenSymbol}
          </span>
        </div>
        {isAmountError && (
          <p className="text-xs sm:text-sm text-red-400 pl-0.5">
            Invalid amount
          </p>
        )}
      </div>

      {/* Action */}
      <div className="col-span-1 flex items-center justify-center h-12">
        <button
          type="button"
          onClick={() => onRemove(recipient.id)}
          disabled={!isRemovable}
          title="Remove wallet"
          aria-label="Remove recipient"
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            isRemovable
              ? "text-slate-400 hover:text-red-400 hover:bg-white/[0.06]"
              : "text-slate-700 cursor-not-allowed opacity-30"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
