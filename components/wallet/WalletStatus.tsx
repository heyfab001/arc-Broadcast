"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "./WalletModal";
import { Wallet, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { ARC_TESTNET } from "@/config/chains";

export interface WalletStatusProps {
  actionLabel?: string;
  className?: string;
}

export function WalletStatus({ actionLabel = "execute this transaction", className }: WalletStatusProps) {
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
        <div className={`p-4 rounded-2xl bg-[#0F1424] border border-arc-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-arc-500/15 border border-arc-500/30 flex items-center justify-center text-arc-400 shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Connect Wallet to continue</h4>
              <p className="text-xs text-slate-400">
                A connected Web3 wallet on Arc Testnet is required to {actionLabel}.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-arc-glow shrink-0"
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
      <div className={`p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300">Switch to Arc Testnet</h4>
            <p className="text-xs text-amber-200/80">
              Your wallet is connected to an unsupported network. Please switch to Arc Testnet ({ARC_TESTNET.id}) to continue.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shrink-0"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  return null;
}
