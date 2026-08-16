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
      title={isConnected ? "Wallet" : "Connect Wallet"}
      description={
        isConnected
          ? undefined
          : "Connect your wallet to continue."
      }
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        {isConnected && address ? (
          <>
            {/* Connected Account Card */}
            <div className="p-4 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Address</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                <span className="font-mono text-xs text-white font-medium break-all">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 ml-2 text-slate-400 hover:text-white rounded hover:bg-white/[0.08] transition-colors shrink-0"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Network</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {isWrongNetwork ? "Wrong Network" : ARC_TESTNET.name}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 block text-[10px]">Balance</span>
                    <button
                      onClick={() => refetchBalance()}
                      className="text-slate-500 hover:text-slate-300"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isBalanceLoading ? "animate-spin" : ""}`} />
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
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Wrong network detected</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="w-full text-xs font-semibold shadow-none bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  Switch to Arc Testnet
                </Button>
              </div>
            )}

            {/* Explorer & Disconnect */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={`${ARC_TESTNET.explorerUrl}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-arc-400 hover:underline flex items-center gap-1"
              >
                <span>View on ArcScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  disconnectWallet();
                  onClose();
                }}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="text-xs"
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
                  className="w-full p-3.5 rounded-xl bg-[#090C16] hover:bg-[#111728] border border-white/[0.08] hover:border-arc-500/40 text-left transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-arc-400">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {connector.name === "Injected"
                          ? "Browser Wallet"
                          : connector.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        MetaMask, Rabby, or Arc Wallet
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-arc-400">
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
