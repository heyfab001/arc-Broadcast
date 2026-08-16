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
        <div className={`p-4 sm:p-5 rounded-xl bg-[#141722] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-semibold text-white">Connect wallet</h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Connect your wallet to start broadcasting payments.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="w-full sm:w-auto h-11 px-5 text-sm font-semibold shrink-0"
          >
            Connect wallet
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
      <div className={`p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm sm:text-base font-semibold text-amber-300">Wrong network</h4>
            <p className="text-xs sm:text-sm text-amber-200/90">
              Please switch your network to Arc Testnet.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full sm:w-auto h-11 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shrink-0 text-sm"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  return null;
}
