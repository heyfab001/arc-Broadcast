"use client";

import React from "react";
import { Recipient } from "@/types/payment";
import { Trash2 } from "lucide-react";
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

  const numLabel = (index + 1).toString().padStart(2, "0");

  return (
    <div className="grid grid-cols-12 gap-2 items-start py-1 group">
      {/* Index */}
      <div className="col-span-1 flex items-center justify-center h-9">
        <span className="font-mono text-[11px] text-slate-500">
          {numLabel}
        </span>
      </div>

      {/* Address */}
      <div className="col-span-7 space-y-0.5">
        <input
          type="text"
          value={recipient.address}
          onChange={(e) => onUpdate(recipient.id, "address", e.target.value)}
          placeholder="0x..."
          className={cn(
            "w-full h-9 bg-[#0C0D12] border rounded-lg px-2.5 text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors",
            isAddressError
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/10 focus:border-blue-500"
          )}
        />
        {isAddressError && (
          <p className="text-[10px] text-red-400 pl-0.5">
            {isDuplicate ? "Duplicate address" : "Invalid address"}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="col-span-3 space-y-0.5">
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
              "w-full h-9 bg-[#0C0D12] border rounded-lg pl-2.5 pr-10 text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors",
              isAmountError
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-blue-500"
            )}
          />
          <span className="absolute right-2 top-2.5 text-[10px] font-medium text-slate-500 pointer-events-none">
            {tokenSymbol}
          </span>
        </div>
        {isAmountError && (
          <p className="text-[10px] text-red-400 pl-0.5">
            Invalid
          </p>
        )}
      </div>

      {/* Action */}
      <div className="col-span-1 flex items-center justify-center h-9">
        <button
          type="button"
          onClick={() => onRemove(recipient.id)}
          disabled={!isRemovable}
          title="Remove"
          className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
            isRemovable
              ? "text-slate-500 hover:text-red-400 hover:bg-white/[0.04]"
              : "text-slate-700 cursor-not-allowed opacity-30"
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
