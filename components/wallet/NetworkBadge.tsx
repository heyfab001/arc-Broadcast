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
            ? "bg-blue-600/10 border-blue-500/30 text-blue-300"
            : isWrongNetwork
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
            : "bg-[#141722] border-white/[0.08] text-slate-200 hover:border-white/20"
        )}
      >
        {isSwitching ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>Switching...</span>
          </>
        ) : isWrongNetwork ? (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Wrong network</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{ARC_TESTNET.name}</span>
          </>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Network configuration"
        description="Arc Testnet parameters."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1 text-sm">
          <div className="space-y-2 bg-[#0C0D12] p-4 rounded-lg border border-white/[0.06] text-slate-300 font-mono">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400 font-sans">Network</span>
              <span className="text-white font-sans font-medium">{ARC_TESTNET.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400 font-sans">Chain ID</span>
              <span className="text-white">{ARC_TESTNET.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400 font-sans">Currency</span>
              <span className="text-white font-sans">{ARC_TESTNET.nativeCurrency.symbol}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-sans">Explorer</span>
              <a
                href={ARC_TESTNET.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 font-sans"
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
