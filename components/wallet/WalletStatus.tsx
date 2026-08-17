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
        <div className={`p-5 rounded-xl bg-white border border-gray-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-base font-semibold text-gray-900">Connect wallet</h4>
              <p className="text-base text-gray-600 leading-relaxed">
                Connect your EVM wallet to start broadcasting USDC payments.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Wallet className="w-5 h-5" />}
            className="w-full sm:w-auto h-12 px-6 text-base font-semibold shrink-0"
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
      <div className={`p-5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-base font-semibold text-amber-900">You&apos;re on the wrong network.</h4>
            <p className="text-base text-amber-800 leading-relaxed">
              Switch to Arc Testnet to continue.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-5 h-5" />}
          className="w-full sm:w-auto h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold shrink-0 text-base shadow-none"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  return null;
}
