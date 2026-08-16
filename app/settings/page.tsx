"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ARC_TESTNET } from "@/config/chains";
import { CONTRACTS } from "@/config/contracts";
import { useArcWallet } from "@/hooks/useArcWallet";
import { showToast } from "@/hooks/useToast";
import {
  Globe,
  Wallet,
  Shield,
  Sliders,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const {
    address,
    isConnected,
    isWrongNetwork,
    isSwitching,
    balanceUSDC,
    isBalanceError,
    switchToArc,
    disconnectWallet,
  } = useArcWallet();

  const [notifyOnClaim, setNotifyOnClaim] = useState(true);
  const [autoValidateAddresses, setAutoValidateAddresses] = useState(true);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleSavePreferences = () => {
    showToast({
      title: "Settings saved",
      message: "Preferences updated.",
      type: "success",
    });
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl">
      {/* Header */}
      <PageHeader
        title="Settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 1: Network */}
        <GlassCard variant="default" className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white">Network</h3>
          </div>

          <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {ARC_TESTNET.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Chain {ARC_TESTNET.id}
              </span>
            </div>

            <div className="space-y-1 text-slate-300 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400 font-sans">RPC</span>
                <span className="truncate max-w-[180px]" title={ARC_TESTNET.rpcUrl}>
                  {ARC_TESTNET.rpcUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400 font-sans">USDC</span>
                <span className="truncate max-w-[180px]" title={ARC_TESTNET.contracts?.usdcErc20}>
                  {ARC_TESTNET.contracts?.usdcErc20}
                </span>
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
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Wallet */}
        <GlassCard variant="default" className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
            <Wallet className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white">Wallet</h3>
          </div>

          <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium text-white">
                {isConnected ? (
                  isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Wrong network
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  )
                ) : (
                  <span className="text-slate-500">Disconnected</span>
                )}
              </span>
            </div>

            {isConnected && address ? (
              <div className="space-y-1.5 pt-1.5 border-t border-white/[0.04]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Address</span>
                  <span className="font-mono text-white text-[11px] truncate max-w-[180px]">
                    {address}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Balance</span>
                  <span className="font-mono font-medium text-white">
                    {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                  </span>
                </div>

                <div className="pt-1 flex gap-2">
                  {isWrongNetwork && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => switchToArc()}
                      isLoading={isSwitching}
                      className="flex-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950"
                    >
                      Switch to Arc
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => disconnectWallet()}
                    className="flex-1 text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Connect your wallet to view details.
              </p>
            )}
          </div>
        </GlassCard>

        {/* Section 3: Security */}
        <GlassCard variant="default" className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
            <Shield className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-1">
              <span className="text-white font-medium block">Client-side generation</span>
              <p className="text-slate-400 text-[11px]">
                Claim secrets are generated in your browser and never sent to a server.
              </p>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">Address validation</span>
              <button
                type="button"
                onClick={() => setAutoValidateAddresses(!autoValidateAddresses)}
                className={`w-8 h-4 rounded-full transition-colors p-0.5 ${
                  autoValidateAddresses ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    autoValidateAddresses ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Section 4: Preferences */}
        <GlassCard variant="default" className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06]">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white">Preferences</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Notifications</span>
                <span className="text-slate-500 text-[11px]">Toast alerts</span>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOnClaim(!notifyOnClaim)}
                className={`w-8 h-4 rounded-full transition-colors p-0.5 ${
                  notifyOnClaim ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    notifyOnClaim ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Diagnostics</span>
                <span className="text-slate-500 text-[11px]">Show contract addresses</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className={`w-8 h-4 rounded-full transition-colors p-0.5 ${
                  showDiagnostics ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    showDiagnostics ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePreferences}
                className="w-full"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && (
        <GlassCard variant="default" className="p-4 space-y-2 text-xs font-mono">
          <h3 className="text-xs font-semibold text-white font-sans">Contract diagnostics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 rounded bg-[#0C0D12] border border-white/[0.06]">
              <span className="text-slate-500 font-sans text-[10px] block">USDC Address</span>
              <span className="text-slate-300 truncate block text-[11px]">{CONTRACTS.arcTestnet.usdc}</span>
            </div>
            <div className="p-2 rounded bg-[#0C0D12] border border-white/[0.06]">
              <span className="text-slate-500 font-sans text-[10px] block">Batch Payment Contract</span>
              <span className="text-slate-300 truncate block text-[11px]">{CONTRACTS.arcTestnet.batchPayment}</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
