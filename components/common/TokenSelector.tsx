"use client";

import React, { useState } from "react";
import { Token } from "@/types/token";
import { SUPPORTED_TOKENS } from "@/config/tokens";
import { Modal } from "@/components/ui/Modal";
import { ChevronDown, Coins, Check } from "lucide-react";
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
          "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#090C16] border border-white/[0.08] hover:border-arc-500/40 hover:bg-[#0E1322] text-white transition-all text-sm font-medium",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-arc-600 to-arc-purple flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
          {selectedToken.symbol.slice(0, 2)}
        </div>
        <span className="font-semibold tracking-tight">{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Token"
        description="Choose token to send on Arc Testnet"
        maxWidth="sm"
      >
        <div className="space-y-1.5 pt-2">
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
                  "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                  isSelected
                    ? "bg-arc-600/15 border-arc-500/40 text-white"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15 text-slate-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-arc-600 to-arc-purple flex items-center justify-center text-xs font-bold text-white">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{token.symbol}</span>
                      {token.isNative && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-arc-500/20 text-arc-300 font-mono">
                          Native Gas
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{token.name}</span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-arc-400" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
