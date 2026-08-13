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
      message: "Your application preferences have been updated locally.",
      type: "success",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Settings & Configuration"
        subtitle="Manage your Arc network environment, connected wallet session, security, and UI preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Network */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Network Settings</h3>
              <p className="text-xs text-slate-400">Official Arc Testnet parameters</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090C16] border border-arc-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {ARC_TESTNET.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-arc-500/20 text-arc-300 border border-arc-500/30 font-semibold">
                Chain ID: {ARC_TESTNET.id} ({ARC_TESTNET.hexId})
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">RPC URL</span>
                <span className="truncate max-w-[200px]" title={ARC_TESTNET.rpcUrl}>
                  {ARC_TESTNET.rpcUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">WebSocket RPC</span>
                <span className="truncate max-w-[200px]" title={ARC_TESTNET.wsRpcUrl}>
                  {ARC_TESTNET.wsRpcUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">USDC ERC-20</span>
                <span className="truncate max-w-[200px]" title={ARC_TESTNET.contracts?.usdcErc20}>
                  {ARC_TESTNET.contracts?.usdcErc20}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-500 font-sans">Native Gas Token</span>
                <span className="text-arc-300 font-semibold">{ARC_TESTNET.nativeCurrency.symbol} (18 decimals)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-sans">Block Explorer</span>
                <a
                  href={ARC_TESTNET.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arc-400 hover:underline flex items-center gap-1"
                >
                  testnet.arcscan.app
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Wallet */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Wallet Connection</h3>
              <p className="text-xs text-slate-400">Active Web3 account session</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090C16] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Connection State:</span>
              <span className="font-semibold text-white">
                {isConnected ? (
                  isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Wrong Network
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected to Arc
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
                  <span className="text-slate-400">Arc USDC Balance:</span>
                  <span className="font-mono font-semibold text-arc-300">
                    {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
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
                Connect your Web3 wallet using the top navigation button to view active account details.
              </p>
            )}
          </div>
        </GlassCard>

        {/* Section 3: Security */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-cyan/10 border border-arc-cyan/20 flex items-center justify-center text-arc-cyan">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Security & Commitments</h3>
              <p className="text-xs text-slate-400">Secret Pay cryptography policy</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Lock className="w-3.5 h-3.5 text-arc-cyan" />
                <span>Zero Plaintext Storage</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Secret Pay hashes preimages in memory before depositing. No central database ever receives unencrypted claim tokens.
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">Strict EVM Address Validation</span>
              <button
                type="button"
                onClick={() => setAutoValidateAddresses(!autoValidateAddresses)}
                className={`w-10 h-6 rounded-full transition-colors p-1 ${
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

        {/* Section 4: Preferences & Diagnostics Toggle */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-600/10 border border-arc-600/20 flex items-center justify-center text-arc-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Preferences</h3>
              <p className="text-xs text-slate-400">User experience & notifications</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Claim Notifications</span>
                <span className="text-slate-500 text-[11px]">Show toast notifications on claim events</span>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOnClaim(!notifyOnClaim)}
                className={`w-10 h-6 rounded-full transition-colors p-1 ${
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

            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Developer Diagnostics Panel</span>
                <span className="text-slate-500 text-[11px]">Inspect canonical contract addresses & bytecode</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className={`w-10 h-6 rounded-full transition-colors p-1 ${
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
                className="w-full"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Production-Safe Diagnostic Panel (Section 5) */}
      {showDiagnostics && (
        <GlassCard variant="glow" className="p-6 space-y-4 animate-fade-in border-arc-500/40">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-arc-500/20 border border-arc-500/30 flex items-center justify-center text-arc-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Runtime Contract Diagnostics</h3>
              <p className="text-xs text-slate-400">Canonical on-chain deployment parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-slate-500 block font-sans text-[11px]">Arc Testnet Chain ID</span>
              <span className="text-white font-bold">{ARC_TESTNET.id}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-slate-500 block font-sans text-[11px]">USDC ERC-20 Interface</span>
              <span className="text-arc-300 truncate block">{CONTRACTS.arcTestnet.usdc}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-slate-500 block font-sans text-[11px]">ArcBatchPayment (Spender & Target)</span>
              <span className="text-emerald-400 truncate block">{CONTRACTS.arcTestnet.batchPayment}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-slate-500 block font-sans text-[11px]">ArcSecretPayment (Escrow Deposit)</span>
              <span className="text-purple-400 truncate block">{CONTRACTS.arcTestnet.secretPayment}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Canonical hardcoded configuration active. Zero private keys or credentials exposed.</span>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
