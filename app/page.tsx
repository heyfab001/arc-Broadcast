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
  TrendingUp,
  Layers,
  Sparkles,
  Lock,
  Wallet,
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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-6 sm:p-10 overflow-hidden border border-white/[0.08] bg-[#090C16]">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-arc-500/10 border border-arc-500/20 text-arc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{ARC_TESTNET.name}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Send tokens, your way.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Batch payments and private claims on Arc.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/broadcast">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Send className="w-4 h-4" />}
                className="font-medium shadow-arc-glow"
              >
                Broadcast Payment
              </Button>
            </Link>

            <Link href="/secret-pay">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<KeyRound className="w-4 h-4 text-arc-purple" />}
                className="font-medium"
              >
                Secret Pay
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Wallet Session Summary (When Connected) */}
      {isConnected && address && (
        <GlassCard variant="default" className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  Connected Wallet
                </span>
                <span className="font-mono text-xs font-semibold text-white">
                  {shortAddress}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-slate-400 block">Network</span>
                <span className="text-xs font-medium text-white flex items-center gap-1.5 mt-0.5">
                  {isWrongNetwork ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Wrong Network
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {ARC_TESTNET.name}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 block">Balance</span>
                  <button
                    onClick={() => refetchBalance()}
                    className="text-slate-500 hover:text-slate-300"
                    title="Refresh balance"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isBalanceLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <span className="text-xs font-bold text-white font-mono block mt-0.5">
                  {isBalanceError ? "Unable to load" : `${balanceUSDC} USDC`}
                </span>
              </div>

              {isWrongNetwork && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => switchToArc()}
                  isLoading={isSwitching}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-none"
                >
                  Switch to Arc Testnet
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Sent"
          value="0.00"
          subValue="USDC"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Total Payments"
          value="0"
          subValue="Batches"
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Claims"
          value="0"
          subValue="Active"
          icon={<Lock className="w-4 h-4 text-arc-purple" />}
        />
        <StatCard
          label="Total Claimed"
          value="0.00"
          subValue="USDC"
          icon={<Sparkles className="w-4 h-4 text-arc-cyan" />}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Broadcast Card */}
        <GlassCard variant="interactive" className="p-5 sm:p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Broadcast Payment</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Send one payment to multiple wallets. Upload CSV or enter addresses directly.
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/broadcast"
              className="inline-flex items-center gap-1 text-xs font-medium text-arc-400 hover:text-arc-300"
            >
              <span>Open Broadcast</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>

        {/* Secret Pay Card */}
        <GlassCard variant="interactive" className="p-5 sm:p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Secret Pay</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Send tokens with a private claim link. No wallet address needed upfront.
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/secret-pay"
              className="inline-flex items-center gap-1 text-xs font-medium text-arc-purple hover:text-arc-300"
            >
              <span>Open Secret Pay</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <Link
            href="/history"
            className="text-xs text-arc-400 hover:text-arc-300 flex items-center gap-1"
          >
            <span>View all</span>
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
