"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { useArcWallet } from "@/hooks/useArcWallet";
import { Connector } from "wagmi";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connectWallet, isConnecting } = useArcWallet();

  const handleSelectConnector = async (connector: Connector) => {
    try {
      await connectWallet(connector);
      onClose();
    } catch {
      // Handled in connectWallet
    }
  };

  const getConnectorIcon = (name: string) => {
    return <Wallet className="w-5 h-5 text-blue-600" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect wallet"
      description="Choose an EVM wallet to connect."
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1 text-base">
        {/* Connector Buttons */}
        <div className="space-y-2.5">
          {connectors.map((connector) => {
            return (
              <button
                key={connector.uid}
                type="button"
                disabled={isConnecting}
                onClick={() => handleSelectConnector(connector)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-left group shadow-2xs",
                  isConnecting && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    {getConnectorIcon(connector.name)}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-base block group-hover:text-blue-600 transition-colors">
                      {connector.name}
                    </span>
                    <span className="text-sm text-gray-500 font-normal">
                      Connect via browser extension
                    </span>
                  </div>
                </div>

                {isConnecting ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <p className="text-sm text-gray-500">
            By connecting, you agree to the Terms of Service.
          </p>
        </div>
      </div>
    </Modal>
  );
}
