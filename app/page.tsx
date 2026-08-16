"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ActivityTable } from "@/components/history/ActivityTable";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { Send, KeyRound, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { transactions, isLoading, error, refresh } = usePaymentHistory();

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Page Heading */}
      <div className="pb-4 border-b border-white/[0.06]">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
          Overview
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Send and receive USDC on Arc.
        </p>
      </div>

      {/* Two Primary Action Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Broadcast Payment Card */}
        <Link href="/broadcast" className="block group">
          <GlassCard variant="interactive" className="p-5 space-y-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Send className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                Broadcast payment
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send to multiple wallets
              </p>
            </div>
          </GlassCard>
        </Link>

        {/* Secret Pay Card */}
        <Link href="/secret-pay" className="block group">
          <GlassCard variant="interactive" className="p-5 space-y-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                Secret pay
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send with a private claim link
              </p>
            </div>
          </GlassCard>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent activity
          </h2>
          <Link
            href="/history"
            className="text-xs text-blue-400 hover:underline"
          >
            View all
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
