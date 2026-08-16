"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useArcWallet } from "@/hooks/useArcWallet";
import { ARC_TESTNET } from "@/config/chains";
import { Button } from "@/components/ui/Button";
import {
  Copy,
  Check,
  ExternalLink,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Wallet,
} from "lucide-react";

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    address,
    isConnected,
    isWrongNetwork,
    isSwitching,
    balanceUSDC,
    isBalanceLoading,
    isBalanceError,
    refetchBalance,
    connectors,
    connectWallet,
    disconnectWallet,
    switchToArc,
  } = useArcWallet();

  const [copied, setCopied] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (connector: (typeof connectors)[number]) => {
    setConnectingId(connector.id);
    try {
      await connectWallet(connector);
      onClose();
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConnected ? "Wallet" : "Connect wallet"}
      description={
        isConnected
          ? undefined
          : "Connect your EVM wallet to continue."
      }
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        {isConnected && address ? (
          <>
            {/* Account Box */}
            <div className="p-4 rounded-xl bg-[#0C0D12] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-400">Address</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                <span className="font-mono text-xs sm:text-sm text-white font-medium break-all">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 ml-2 text-slate-400 hover:text-white rounded hover:bg-white/[0.08] transition-colors shrink-0"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-xs">Network</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {isWrongNetwork ? "Wrong network" : ARC_TESTNET.name}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 block text-xs">Balance</span>
                    <button
                      onClick={() => refetchBalance()}
                      className="text-slate-400 hover:text-slate-200"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3 h-3 ${isBalanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <span className="font-semibold text-white mt-0.5 block font-mono">
                    {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                  </span>
                </div>
              </div>
            </div>

            {/* Wrong Network Notice */}
            {isWrongNetwork && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Wrong network</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="w-full h-11 text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
                >
                  Switch to Arc Testnet
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={`${ARC_TESTNET.explorerUrl}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <span>View on ArcScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  disconnectWallet();
                  onClose();
                }}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="h-10 px-3.5 text-xs sm:text-sm"
              >
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            {connectors.map((connector) => {
              const isThisConnecting = connectingId === connector.id;
              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={isThisConnecting}
                  className="w-full p-4 rounded-xl bg-[#0C0D12] hover:bg-[#181B26] border border-white/[0.08] hover:border-white/20 text-left transition-colors flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-slate-300">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white">
                        {connector.name === "Injected"
                          ? "Browser wallet"
                          : connector.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400">
                        MetaMask, Rabby, or Arc
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-blue-400">
                    {isThisConnecting ? "Connecting..." : "Connect"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
