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
          "flex items-center gap-2.5 px-4 h-12 rounded-lg bg-[#0C0D12] border border-white/15 hover:border-white/25 text-white transition-colors text-base font-semibold",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span>{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select token"
        description="Choose token on Arc Testnet."
        maxWidth="sm"
      >
        <div className="space-y-1.5 pt-1">
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
                  "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors text-sm sm:text-base",
                  isSelected
                    ? "bg-blue-600/10 border-blue-500/40 text-white"
                    : "bg-[#0C0D12] border-white/[0.06] hover:bg-white/[0.04] text-slate-300"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base">{token.symbol}</span>
                    {token.isNative && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono">
                        Gas
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">{token.name}</span>
                </div>

                {isSelected && <Check className="w-4 h-4 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
