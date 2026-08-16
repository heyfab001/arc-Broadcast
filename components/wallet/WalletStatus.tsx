"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "./WalletModal";
import { Wallet, AlertTriangle, RefreshCw } from "lucide-react";

export interface WalletStatusProps {
  className?: string;
}

export function WalletStatus({ className }: WalletStatusProps) {
  const {
    isConnected,
    isWrongNetwork,
    isSwitching,
    switchToArc,
  } = useArcWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isConnected) {
    return (
      <>
        <div className={`p-4 rounded-xl bg-[#090C16] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400 shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Connect wallet</h4>
              <p className="text-[11px] text-slate-400">
                Connect your wallet to get started.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto shadow-arc-glow shrink-0 text-xs"
          >
            Connect Wallet
          </Button>
        </div>

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className={`p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-300">Switch to Arc Testnet</h4>
            <p className="text-[11px] text-amber-200/80">
              Please switch your network to Arc Testnet to continue.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shrink-0 text-xs shadow-none"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  return null;
}
