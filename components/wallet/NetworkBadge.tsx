"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { ARC_TESTNET } from "@/config/chains";
import { Modal } from "@/components/ui/Modal";
import { ChevronDown, ExternalLink, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkBadge() {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc, currentNetwork } = useArcWallet();
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
          "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 backdrop-blur-md select-none",
          isSwitching
            ? "bg-arc-500/15 border-arc-500/30 text-arc-300 animate-pulse"
            : isWrongNetwork
            ? "bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-sm"
            : "bg-[#0E1322]/80 border-arc-500/20 text-slate-200 hover:border-arc-500/40 hover:bg-[#12192D]"
        )}
      >
        {isSwitching ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-arc-400 animate-spin" />
            <span className="font-semibold">Switching...</span>
          </>
        ) : isWrongNetwork ? (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-300">Wrong Network</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="font-semibold">{ARC_TESTNET.name}</span>
          </>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Network Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Network Configuration"
        description="Official Arc Testnet development network"
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          {/* Active Network Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-arc-500/30 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {ARC_TESTNET.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-arc-500/20 text-arc-300 border border-arc-500/30">
                  Target Chain
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Native Gas Token: <span className="text-arc-300 font-semibold">{ARC_TESTNET.nativeCurrency.symbol}</span>
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-arc-400 shrink-0" />
          </div>

          {/* Network Parameters */}
          <div className="space-y-2.5 text-xs text-slate-300 bg-[#07090F] p-4 rounded-xl border border-white/[0.06]">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">Chain ID</span>
              <span className="font-mono text-white font-semibold">{ARC_TESTNET.id} ({ARC_TESTNET.hexId})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">RPC Endpoint</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]" title={ARC_TESTNET.rpcUrl}>
                {ARC_TESTNET.rpcUrl}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">USDC ERC-20</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]" title={ARC_TESTNET.contracts?.usdcErc20}>
                {ARC_TESTNET.contracts?.usdcErc20}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Explorer</span>
              <a
                href={ARC_TESTNET.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-arc-400 hover:text-arc-300 flex items-center gap-1 font-mono hover:underline"
              >
                testnet.arcscan.app
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {isWrongNetwork && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">You are on an unsupported EVM network</p>
                <p className="text-amber-300/80 mt-0.5">Please switch back to Arc Testnet to transact.</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                switchToArc();
                setIsModalOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-arc-600 hover:bg-arc-500 text-white rounded-xl text-xs font-semibold shadow-arc-glow transition-all"
            >
              Switch to Arc Testnet ({ARC_TESTNET.id})
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
