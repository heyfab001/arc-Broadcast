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
  Lock,
  Terminal,
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
      title: "Settings Saved",
      message: "Preferences updated.",
      type: "success",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Settings"
        subtitle="Network, wallet, and application preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Network */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Network</h3>
              <p className="text-xs text-slate-400">Arc Testnet parameters</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {ARC_TESTNET.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                Chain {ARC_TESTNET.id}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">RPC URL</span>
                <span className="truncate max-w-[180px]" title={ARC_TESTNET.rpcUrl}>
                  {ARC_TESTNET.rpcUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">USDC ERC-20</span>
                <span className="truncate max-w-[180px]" title={ARC_TESTNET.contracts?.usdcErc20}>
                  {ARC_TESTNET.contracts?.usdcErc20}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-sans">Explorer</span>
                <a
                  href={ARC_TESTNET.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arc-400 hover:underline flex items-center gap-1 font-sans"
                >
                  ArcScan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Wallet */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Wallet</h3>
              <p className="text-xs text-slate-400">Connected account details</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090C16] border border-white/[0.06] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold text-white">
                {isConnected ? (
                  isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Wrong Network
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
              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div>
                  <span className="text-[11px] text-slate-500 block">Address</span>
                  <span className="font-mono text-xs text-white block bg-black/40 p-2 rounded-lg border border-white/[0.04] truncate">
                    {address}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Balance:</span>
                  <span className="font-mono font-semibold text-white">
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
                      className="flex-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-none font-bold"
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
              <p className="text-xs text-slate-500 pt-1">
                Connect your wallet to view active session details.
              </p>
            )}
          </div>
        </GlassCard>

        {/* Section 3: Security */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-cyan/10 border border-arc-cyan/20 flex items-center justify-center text-arc-cyan">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Security</h3>
              <p className="text-xs text-slate-400">Client-side protection</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Lock className="w-3.5 h-3.5 text-arc-cyan" />
                <span>Client-Side Generation</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Claim secrets are generated in your browser and never transmitted to any server.
              </p>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Strict address validation</span>
              <button
                type="button"
                onClick={() => setAutoValidateAddresses(!autoValidateAddresses)}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  autoValidateAddresses ? "bg-arc-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoValidateAddresses ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Section 4: Preferences */}
        <GlassCard variant="default" className="p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-600/10 border border-arc-600/20 flex items-center justify-center text-arc-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Preferences</h3>
              <p className="text-xs text-slate-400">Notifications & tools</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Notifications</span>
                <span className="text-slate-500 text-[11px]">Show toast notifications</span>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOnClaim(!notifyOnClaim)}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  notifyOnClaim ? "bg-arc-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifyOnClaim ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Diagnostics</span>
                <span className="text-slate-500 text-[11px]">Inspect contract addresses</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  showDiagnostics ? "bg-arc-500" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showDiagnostics ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePreferences}
                className="w-full text-xs"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && (
        <GlassCard variant="default" className="p-5 space-y-3 animate-fade-in border-arc-500/30">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
            <Terminal className="w-4 h-4 text-arc-400" />
            <h3 className="text-xs font-semibold text-white">Contract Diagnostics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 block font-sans text-[10px]">Arc Testnet Chain ID</span>
              <span className="text-white">{ARC_TESTNET.id}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 block font-sans text-[10px]">USDC Address</span>
              <span className="text-arc-300 truncate block">{CONTRACTS.arcTestnet.usdc}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 block font-sans text-[10px]">ArcBatchPayment</span>
              <span className="text-emerald-400 truncate block">{CONTRACTS.arcTestnet.batchPayment}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 block font-sans text-[10px]">ArcSecretPayment</span>
              <span className="text-purple-400 truncate block">{CONTRACTS.arcTestnet.secretPayment}</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
