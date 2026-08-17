"use client";

import React, { useState } from "react";
import { Token } from "@/types/token";
import { SUPPORTED_TOKENS } from "@/config/tokens";
import { Modal } from "@/components/ui/Modal";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TokenSelectorProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  disabled?: boolean;
}

export function TokenSelector({
  selectedToken,
  onSelectToken,
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2.5 px-4 h-12 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-gray-900 shadow-2xs transition-colors text-base font-semibold",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50"
        )}
      >
        <span>{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select token"
        description="Choose token on Arc Testnet."
        maxWidth="sm"
      >
        <div className="space-y-2 pt-1">
          {SUPPORTED_TOKENS.map((token) => {
            const isSelected = token.symbol === selectedToken.symbol;
            return (
              <button
                key={token.symbol}
                type="button"
                onClick={() => {
                  onSelectToken(token);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-colors",
                  isSelected
                    ? "bg-blue-50 border-blue-200 text-blue-900"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-base">{token.symbol}</span>
                    {token.isNative && (
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono font-medium">
                        Gas
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </div>

                {isSelected && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
