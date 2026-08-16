"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "./WalletModal";
import { Wallet, ChevronDown, AlertTriangle } from "lucide-react";

export function WalletButton() {
  const {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    isWrongNetwork,
    isSwitching,
    switchToArc,
    balanceUSDC,
  } = useArcWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isSwitching) {
    return (
      <Button
        variant="outline"
        size="sm"
        isLoading
        className="text-xs min-w-[100px]"
      >
        Switching
      </Button>
    );
  }

  if (isConnecting) {
    return (
      <Button
        variant="secondary"
        size="sm"
        isLoading
        className="font-mono text-xs min-w-[100px]"
      >
        Connecting
      </Button>
    );
  }

  if (isConnected && isWrongNetwork) {
    return (
      <>
        <Button
          variant="danger"
          size="sm"
          onClick={() => switchToArc()}
          leftIcon={<AlertTriangle className="w-3 h-3 text-amber-400" />}
          className="text-xs"
        >
          Switch to Arc
        </Button>

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  if (isConnected && address) {
    return (
      <>
        <div className="flex items-center gap-1.5">
          {/* Balance */}
          <div className="hidden sm:flex items-center px-2.5 h-8 rounded-lg bg-[#141722] border border-white/[0.08] text-xs font-mono text-white">
            <span>{balanceUSDC} USDC</span>
          </div>

          {/* Address Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-[#141722] hover:bg-[#1C202E] border border-white/[0.08] text-xs text-white transition-colors"
          >
            <span className="font-mono">{shortAddress}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        leftIcon={<Wallet className="w-3.5 h-3.5" />}
        className="text-xs"
      >
        Connect wallet
      </Button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
