"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ActivityTable } from "@/components/history/ActivityTable";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { useArcWallet } from "@/hooks/useArcWallet";
import { ARC_TESTNET } from "@/config/chains";
import {
  Send,
  KeyRound,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  Sparkles,
  Lock,
  Wallet,
  Globe,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const {
    address,
    shortAddress,
    isConnected,
    isWrongNetwork,
    isSwitching,
    balanceUSDC,
    isBalanceLoading,
    isBalanceError,
    refetchBalance,
    switchToArc,
  } = useArcWallet();
  const { transactions, isLoading, error, refresh } = usePaymentHistory();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0D1222] via-[#090C16] to-[#07090E] shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-arc-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-arc-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-arc-500/10 border border-arc-500/30 text-arc-300">
            <span className="w-2 h-2 rounded-full bg-arc-cyan animate-pulse" />
            <span>Built for Arc Ecosystem</span>
            <span className="text-arc-500/50">&bull;</span>
            <span className="font-mono">{ARC_TESTNET.name}</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Send smarter <br />
              <span className="bg-gradient-to-r from-arc-400 via-arc-500 to-arc-purple bg-clip-text text-transparent">
                on Arc.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Batch payments for up to 100 wallets. Private claims through secure cryptographic links.
            </p>
          </div>

          {/* Primary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href="/broadcast">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Send className="w-4 h-4" />}
                className="shadow-arc-glow-lg font-semibold"
              >
                Broadcast Payment
              </Button>
            </Link>

            <Link href="/secret-pay">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<KeyRound className="w-4 h-4 text-arc-purple" />}
                className="font-semibold"
              >
                Create Secret Payment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Connected Session Status Overview (Live Real Data) */}
      {isConnected && address && (
        <GlassCard variant="glow" glowColor={isWrongNetwork ? "purple" : "blue"} className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Wallet Session
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  {shortAddress}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Network */}
              <div>
                <span className="text-[11px] text-slate-400 block">Network</span>
                <span className="text-xs font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  {isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Wrong Network
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {ARC_TESTNET.name}
                    </span>
                  )}
                </span>
              </div>

              {/* Real USDC Balance */}
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 block">Arc USDC Balance</span>
                  <button
                    onClick={() => refetchBalance()}
                    className="text-slate-500 hover:text-slate-300"
                    title="Refresh balance"
                  >
                    <RefreshCw className={`w-3 h-3 ${isBalanceLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <span className="text-sm font-bold text-arc-300 font-mono block mt-0.5">
                  {isBalanceError ? (
                    <span className="text-amber-400 text-xs font-sans">Unable to load</span>
                  ) : (
                    `${balanceUSDC} USDC`
                  )}
                </span>
              </div>

              {isWrongNetwork && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-none"
                >
                  Switch to Arc
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Stats Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Protocol Metrics
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Arc Testnet (5042002)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Sent"
            value="0.00"
            subValue="USDC"
            isReadyForLive
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: "Awaiting first batch", positive: false }}
          />

          <StatCard
            label="Total Payments"
            value="0"
            subValue="Batches"
            isReadyForLive
            icon={<Layers className="w-5 h-5" />}
            trend={{ value: "Max 100 / batch", positive: true }}
          />

          <StatCard
            label="Pending Claims"
            value="0"
            subValue="Escrows"
            isReadyForLive
            icon={<Lock className="w-5 h-5 text-arc-purple" />}
            trend={{ value: "ZK Timelocked", positive: true }}
          />

          <StatCard
            label="Total Claimed"
            value="0.00"
            subValue="USDC"
            isReadyForLive
            icon={<Sparkles className="w-5 h-5 text-arc-cyan" />}
            trend={{ value: "Sub-second finality", positive: true }}
          />
        </div>
      </div>

      {/* Feature Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Broadcast Feature Card */}
        <GlassCard variant="interactive" className="p-6 relative group overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
              1 &rarr; 100 Wallets
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-arc-300 transition-colors">
            Broadcast Payment
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            Distribute payroll, rewards, or token airdrops to multiple addresses in a single atomic transaction. Includes full CSV upload support and address validation.
          </p>

          <Link href="/broadcast">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-arc-400 group-hover:text-arc-300">
              Open Broadcast Studio &rarr;
            </span>
          </Link>
        </GlassCard>

        {/* Secret Pay Feature Card */}
        <GlassCard variant="interactive" className="p-6 relative group overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple group-hover:scale-110 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-arc-purple/15 text-arc-300 border border-arc-purple/30">
              Zero-Knowledge Claim
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-arc-purple transition-colors">
            Secret Pay
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            Deposit tokens into a secure cryptographic escrow and share a private claim link. The recipient connects their wallet and claims directly without prior address exchange.
          </p>

          <Link href="/secret-pay">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-arc-purple group-hover:text-arc-300">
              Create Secret Link &rarr;
            </span>
          </Link>
        </GlassCard>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Recent Activity
          </h2>
          <Link
            href="/history"
            className="text-xs text-arc-400 hover:text-arc-300 flex items-center gap-1 hover:underline"
          >
            <span>View all transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ActivityTable
          transactions={transactions.slice(0, 5)}
          isLoading={isLoading}
          error={error}
          onRetry={refresh}
        />
      </div>
    </div>
  );
}
