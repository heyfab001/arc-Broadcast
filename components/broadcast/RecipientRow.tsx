"use client";

import React from "react";
import { Recipient } from "@/types/payment";
import { Trash2, AlertCircle } from "lucide-react";
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
}

export function RecipientRow({
  index,
  recipient,
  tokenSymbol,
  isDuplicate = false,
  onUpdate,
  onRemove,
  isRemovable,
}: RecipientRowProps) {
  const isAddressFilled = recipient.address.trim() !== "";
  const isAddressValid = isAddressFilled && isValidEthereumAddress(recipient.address);
  const isAddressError = isAddressFilled && (!isAddressValid || isDuplicate);

  const isAmountFilled = recipient.amount.trim() !== "";
  const isAmountValid = isAmountFilled && isValidAmount(recipient.amount);
  const isAmountError = isAmountFilled && !isAmountValid;

  return (
    <div className="grid grid-cols-12 gap-2.5 items-start py-1.5 group">
      {/* Index */}
      <div className="col-span-1 flex items-center justify-center h-10">
        <span className="font-mono text-xs text-slate-500">
          {index + 1}
        </span>
      </div>

      {/* Address */}
      <div className="col-span-7 space-y-1">
        <div className="relative">
          <input
            type="text"
            value={recipient.address}
            onChange={(e) => onUpdate(recipient.id, "address", e.target.value)}
            placeholder="0x..."
            className={cn(
              "w-full h-10 bg-[#090C16] border rounded-xl px-3 text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors",
              isAddressError
                ? "border-red-500/50 bg-red-500/[0.02] focus:border-red-500"
                : "border-white/[0.08] focus:border-arc-500"
            )}
          />
          {isAddressError && (
            <div className="absolute right-3 top-2.5 text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {isAddressError && (
          <p className="text-[11px] text-red-400 pl-1">
            {isDuplicate ? "Duplicate address" : "Invalid address"}
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
              "w-full h-10 bg-[#090C16] border rounded-xl pl-3 pr-12 text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors",
              isAmountError
                ? "border-red-500/50 bg-red-500/[0.02] focus:border-red-500"
                : "border-white/[0.08] focus:border-arc-500"
            )}
          />
          <span className="absolute right-3 top-3 text-[10px] font-medium text-slate-500 pointer-events-none">
            {tokenSymbol}
          </span>
        </div>
        {isAmountError && (
          <p className="text-[11px] text-red-400 pl-1">
            Invalid amount
          </p>
        )}
      </div>

      {/* Remove */}
      <div className="col-span-1 flex items-center justify-center h-10">
        <button
          type="button"
          onClick={() => onRemove(recipient.id)}
          disabled={!isRemovable}
          title="Remove recipient"
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isRemovable
              ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
              : "text-slate-700 cursor-not-allowed opacity-30"
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
