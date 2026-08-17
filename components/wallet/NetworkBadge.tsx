"use client";

import React, { useState } from "react";
import { useArcWallet } from "@/hooks/useArcWallet";
import { ARC_TESTNET } from "@/config/chains";
import { Modal } from "@/components/ui/Modal";
import { Check, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkBadge() {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc } = useArcWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[15px] font-medium text-gray-700 select-none">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span className="hidden sm:inline">Arc Testnet</span>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchToArc()}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 text-[15px] font-semibold transition-colors"
      >
        {isSwitching ? (
          <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        )}
        <span>{isSwitching ? "Switching..." : "Switch to Arc Testnet"}</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-[15px] font-semibold transition-colors shadow-2xs"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span>Arc Testnet ✓</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Network"
        description="Connected to Arc Testnet."
        maxWidth="sm"
      >
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-[15px]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="font-semibold text-gray-900 block">{ARC_TESTNET.name}</span>
                <span className="text-xs text-gray-500 font-mono">Chain ID: {ARC_TESTNET.id}</span>
              </div>
            </div>
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </Modal>
    </>
  );
}
