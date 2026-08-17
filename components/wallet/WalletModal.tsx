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
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">Connected Address</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                <span className="font-mono text-xs sm:text-sm text-gray-900 font-medium break-all">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 ml-2 text-gray-400 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors shrink-0"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-2xs">
                  <span className="text-gray-500 block text-xs">Network</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block truncate">
                    {isWrongNetwork ? "Wrong network" : ARC_TESTNET.name}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 block text-xs">Balance</span>
                    <button
                      onClick={() => refetchBalance()}
                      className="text-gray-400 hover:text-gray-700"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3 h-3 ${isBalanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900 mt-0.5 block font-mono">
                    {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                  </span>
                </div>
              </div>
            </div>

            {/* Wrong Network Notice */}
            {isWrongNetwork && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-800 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Wrong network selected</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="w-full h-11 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-none"
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
                className="text-sm text-blue-600 hover:underline flex items-center gap-1.5 font-medium"
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
                className="h-10 px-3.5 text-sm"
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
                  className="w-full p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-2xs text-left transition-colors flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {connector.name === "Injected"
                          ? "Browser wallet"
                          : connector.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        MetaMask, Rabby, or Arc
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
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
