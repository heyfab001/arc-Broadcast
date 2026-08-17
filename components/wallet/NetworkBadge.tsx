"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { ARC_TESTNET } from "@/config/chains";
import { Modal } from "@/components/ui/Modal";
import { ChevronDown, ExternalLink, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkBadge() {
  const { isWrongNetwork, isSwitching, switchToArc } = useArcWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          if (isWrongNetwork) {
            switchToArc();
          } else {
            setIsModalOpen(true);
          }
        }}
        disabled={isSwitching}
        className={cn(
          "flex items-center gap-2 px-3 h-10 rounded-lg border text-sm font-medium transition-colors select-none",
          isSwitching
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : isWrongNetwork
            ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
            : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-2xs"
        )}
      >
        {isSwitching ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Switching...</span>
          </>
        ) : isWrongNetwork ? (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Wrong network</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{ARC_TESTNET.name}</span>
          </>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Network configuration"
        description="Arc Testnet parameters."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1 text-sm">
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 font-mono text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-gray-200/70">
              <span className="text-gray-500 font-sans">Network</span>
              <span className="text-gray-900 font-sans font-semibold">{ARC_TESTNET.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200/70">
              <span className="text-gray-500 font-sans">Chain ID</span>
              <span className="text-gray-900 font-semibold">{ARC_TESTNET.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200/70">
              <span className="text-gray-500 font-sans">Currency</span>
              <span className="text-gray-900 font-sans">{ARC_TESTNET.nativeCurrency.symbol}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-sans">Explorer</span>
              <a
                href={ARC_TESTNET.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-sans font-medium"
              >
                <span>ArcScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {isWrongNetwork && (
            <button
              onClick={() => {
                switchToArc();
                setIsModalOpen(false);
              }}
              className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition-colors"
            >
              Switch to Arc Testnet
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}
