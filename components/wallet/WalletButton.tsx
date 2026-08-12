"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "./WalletModal";
import { Wallet, ChevronDown, AlertTriangle, RefreshCw } from "lucide-react";

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

  // 1. Switching network state
  if (isSwitching) {
    return (
      <Button
        variant="outline"
        size="sm"
        isLoading
        className="font-medium text-xs border-arc-500/40 text-arc-300 min-w-[130px]"
      >
        Switching...
      </Button>
    );
  }

  // 2. Connecting state
  if (isConnecting) {
    return (
      <Button
        variant="secondary"
        size="sm"
        isLoading
        className="font-mono text-xs min-w-[130px]"
      >
        Connecting...
      </Button>
    );
  }

  // 3. Connected + Wrong Network
  if (isConnected && isWrongNetwork) {
    return (
      <>
        <Button
          variant="danger"
          size="sm"
          onClick={() => switchToArc()}
          leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          className="text-xs font-semibold bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
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

  // 4. Connected + Arc Testnet
  if (isConnected && address) {
    return (
      <>
        <div className="flex items-center gap-2">
          {/* Native Arc USDC Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090C16] border border-white/[0.08] text-xs font-mono">
            <span className="text-slate-400">Balance:</span>
            <span className="font-semibold text-arc-300">{balanceUSDC} USDC</span>
          </div>

          {/* Wallet Address Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1424] hover:bg-[#151D34] border border-white/[0.1] hover:border-arc-500/30 text-xs text-white transition-all duration-200 shadow-sm"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-arc-600 to-arc-purple flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono">
              {address.slice(2, 4)}
            </div>
            <span className="font-mono font-medium">{shortAddress}</span>
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

  // 5. Disconnected
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        leftIcon={<Wallet className="w-3.5 h-3.5" />}
        className="text-xs font-semibold shadow-arc-glow"
      >
        Connect Wallet
      </Button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
