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
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <PageHeader
        title="Settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Network */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Network</h3>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0D12] border border-white/[0.06] space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {ARC_TESTNET.name}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded">
                Chain {ARC_TESTNET.id}
              </span>
            </div>

            <div className="space-y-2 text-slate-300 font-mono text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400 font-sans">RPC</span>
                <span className="truncate max-w-[200px]" title={ARC_TESTNET.rpcUrl}>
                  {ARC_TESTNET.rpcUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400 font-sans">USDC</span>
                <span className="truncate max-w-[200px]" title={ARC_TESTNET.contracts?.usdcErc20}>
                  {ARC_TESTNET.contracts?.usdcErc20}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Explorer</span>
                <a
                  href={ARC_TESTNET.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1.5 font-sans font-medium"
                >
                  <span>ArcScan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Wallet */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <Wallet className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Wallet</h3>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0D12] border border-white/[0.06] space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium text-white">
                {isConnected ? (
                  isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Wrong network
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Connected
                    </span>
                  )
                ) : (
                  <span className="text-slate-400">Disconnected</span>
                )}
              </span>
            </div>

            {isConnected && address ? (
              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Address</span>
                  <span className="font-mono text-white text-xs sm:text-sm truncate max-w-[200px]">
                    {address}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Balance</span>
                  <span className="font-mono font-semibold text-white">
                    {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                  </span>
                </div>

                <div className="pt-2 flex gap-2.5">
                  {isWrongNetwork && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => switchToArc()}
                      isLoading={isSwitching}
                      className="flex-1 h-11 text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
                    >
                      Switch to Arc
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => disconnectWallet()}
                    className="flex-1 h-11 text-sm font-semibold"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Connect your wallet to view details.
              </p>
            )}
          </div>
        </GlassCard>

        {/* Section 3: Security */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-xl bg-[#0C0D12] border border-white/[0.06] space-y-1">
              <span className="text-white font-semibold block">Client-side generation</span>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Claim secrets are generated in your browser and never sent to a server.
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-300">Address validation</span>
              <button
                type="button"
                onClick={() => setAutoValidateAddresses(!autoValidateAddresses)}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 ${
                  autoValidateAddresses ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoValidateAddresses ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Section 4: Preferences */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Preferences</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Notifications</span>
                <span className="text-slate-400 text-xs sm:text-sm">Show toast alerts</span>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOnClaim(!notifyOnClaim)}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 ${
                  notifyOnClaim ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyOnClaim ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Diagnostics</span>
                <span className="text-slate-400 text-xs sm:text-sm">Show contract addresses</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 ${
                  showDiagnostics ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showDiagnostics ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleSavePreferences}
                className="w-full h-11 text-sm font-semibold"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && (
        <GlassCard variant="default" className="p-5 space-y-3 text-sm font-mono">
          <h3 className="text-sm font-semibold text-white font-sans">Contract diagnostics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06]">
              <span className="text-slate-400 font-sans text-xs block">USDC Address</span>
              <span className="text-slate-200 truncate block text-xs sm:text-sm">{CONTRACTS.arcTestnet.usdc}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06]">
              <span className="text-slate-400 font-sans text-xs block">Batch Payment Contract</span>
              <span className="text-slate-200 truncate block text-xs sm:text-sm">{CONTRACTS.arcTestnet.batchPayment}</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
