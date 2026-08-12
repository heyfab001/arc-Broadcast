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
  ShieldCheck,
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
      title={isConnected ? "Wallet Session" : "Connect Wallet"}
      description={
        isConnected
          ? "Connected to Arc Broadcast Payment"
          : "Choose an EVM wallet provider to connect with Arc Testnet"
      }
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        {isConnected && address ? (
          <>
            {/* Connected Account Card */}
            <div className="p-4 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Connected Address</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                <span className="font-mono text-xs sm:text-sm text-white font-medium break-all">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 ml-2 text-slate-400 hover:text-white rounded-md hover:bg-white/[0.08] transition-colors shrink-0"
                  title="Copy full address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Network and Native USDC Balance Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Network</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {isWrongNetwork ? "Unsupported Network" : ARC_TESTNET.name}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 block text-[11px]">Arc USDC Balance</span>
                    <button
                      onClick={() => refetchBalance()}
                      className="text-slate-500 hover:text-slate-300"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`w-3 h-3 ${isBalanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <span className="font-semibold text-arc-300 mt-0.5 block font-mono">
                    {isBalanceError ? (
                      <span className="text-amber-400 text-[11px]">Unable to load</span>
                    ) : (
                      `${balanceUSDC} USDC`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Wrong Network Notice & Switch Button */}
            {isWrongNetwork && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Wrong Network Detected</p>
                    <p className="text-amber-300/80 mt-0.5">
                      Please switch to Arc Testnet (Chain ID {ARC_TESTNET.id}) to execute batch payments or claims.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="w-full text-xs font-semibold shadow-arc-glow"
                >
                  Switch to Arc Testnet
                </Button>
              </div>
            )}

            {/* Explorer & Disconnect Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`${ARC_TESTNET.explorerUrl}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-arc-400 hover:text-arc-300 flex items-center gap-1.5 hover:underline"
              >
                View on ArcScan
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
              >
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {/* Real Wagmi Connectors List */}
            {connectors.length > 0 ? (
              connectors.map((connector) => {
                const isThisConnecting = connectingId === connector.id;
                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={isThisConnecting}
                    className="w-full p-4 rounded-xl bg-[#090C16] hover:bg-[#111728] border border-white/[0.08] hover:border-arc-500/40 text-left transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform text-arc-400">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-arc-300 transition-colors">
                          {connector.name === "Injected"
                            ? "Browser Wallet (MetaMask / Rabby / Arc)"
                            : connector.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Connect with your installed Web3 EVM provider
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-arc-400 group-hover:translate-x-0.5 transition-transform">
                      {isThisConnecting ? "Connecting..." : "Connect &rarr;"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <Wallet className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-white">No compatible wallet detected.</p>
                <p className="text-xs text-slate-400">
                  Please install an EVM wallet extension such as MetaMask or Rabby in your browser.
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-arc-500/[0.05] border border-arc-500/20 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-arc-400 shrink-0" />
              <span>Direct RPC connection to Arc Testnet (5042002).</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
