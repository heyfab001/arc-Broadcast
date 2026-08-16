"use client";

import React, { useState, useEffect } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "./WalletModal";
import { showToast } from "@/hooks/useToast";
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
  const [hasNotifiedConnect, setHasNotifiedConnect] = useState(false);

  useEffect(() => {
    if (isConnected && !hasNotifiedConnect) {
      showToast({
        title: "Wallet connected",
        message: shortAddress ? `Connected as ${shortAddress}` : undefined,
        type: "success",
      });
      setHasNotifiedConnect(true);
    } else if (!isConnected) {
      setHasNotifiedConnect(false);
    }
  }, [isConnected, hasNotifiedConnect, shortAddress]);

  if (isSwitching) {
    return (
      <Button
        variant="outline"
        size="sm"
        isLoading
        className="h-10 px-3.5 text-sm font-medium min-w-[120px]"
      >
        Switching...
      </Button>
    );
  }

  if (isConnecting) {
    return (
      <Button
        variant="secondary"
        size="sm"
        isLoading
        className="h-10 px-3.5 text-sm font-medium min-w-[120px]"
      >
        Connecting...
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
          leftIcon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          className="h-10 px-3.5 text-sm font-semibold"
        >
          Switch to Arc Testnet
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
        <div className="flex items-center gap-2">
          {/* Balance */}
          <div className="hidden sm:flex items-center px-3 h-10 rounded-lg bg-[#141722] border border-white/[0.08] text-sm font-mono font-medium text-white">
            <span>{balanceUSDC} USDC</span>
          </div>

          {/* Address Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 h-10 rounded-lg bg-[#141722] hover:bg-[#1C202E] border border-white/[0.08] text-sm font-medium text-white transition-colors"
          >
            <span className="font-mono">{shortAddress}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
        leftIcon={<Wallet className="w-4 h-4" />}
        className="h-10 px-4 text-sm font-semibold"
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
