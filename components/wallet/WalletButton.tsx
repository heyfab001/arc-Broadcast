"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { WalletModal } from "./WalletModal";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ARC_TESTNET } from "@/config/chains";
import { showToast } from "@/hooks/useToast";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
} from "lucide-react";

export function WalletButton() {
  const {
    isConnected,
    shortAddress,
    address,
    balanceUSDC,
    isBalanceError,
    disconnectWallet,
  } = useArcWallet();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      showToast({
        title: "Address copied",
        message: "Wallet address copied.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        title: "Copy failed",
        message: "Could not copy address.",
        type: "error",
      });
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsConnectModalOpen(true)}
          leftIcon={<Wallet className="w-4 h-4" />}
          className="h-10 px-4 text-base font-semibold"
        >
          Connect wallet
        </Button>
        <WalletModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
        />
      </>
    );
  }

  const explorerUrl = `${ARC_TESTNET.explorerUrl}/address/${address}`;

  return (
    <>
      <button
        onClick={() => setIsDetailsModalOpen(true)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-gray-900 transition-colors shadow-2xs group"
      >
        <span className="font-mono text-base font-semibold text-gray-900 hidden sm:inline">
          {isBalanceError ? "-" : `${balanceUSDC} USDC`}
        </span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <span className="font-mono text-[15px] text-gray-700 font-medium">
          {shortAddress}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
      </button>

      {/* Wallet Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Wallet account"
        description="Connected to Arc Testnet."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1 text-base">
          {/* Address Box */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Address</span>
              <button
                onClick={handleCopy}
                className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-[15px] font-semibold text-gray-900 break-all select-all">
              {address}
            </p>
          </div>

          {/* Balance Box */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">USDC Balance</span>
            <span className="font-mono font-bold text-gray-900 text-lg">
              {balanceUSDC} USDC
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[15px] font-medium text-gray-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                View on ArcScan
              </span>
              <span className="text-gray-400 font-mono text-xs">↗</span>
            </a>

            <button
              onClick={() => {
                disconnectWallet();
                setIsDetailsModalOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/80 text-[15px] font-semibold text-red-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Disconnect
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
