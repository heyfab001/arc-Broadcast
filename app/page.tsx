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
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Page Heading */}
      <div className="pb-5 border-b border-white/[0.06] space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
          Send USDC on Arc
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Send to multiple wallets or create a private claim link.
        </p>
      </div>

      {/* Two Primary Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Broadcast Payment Card */}
        <Link href="/broadcast" className="block group">
          <GlassCard variant="interactive" className="p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Send className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Broadcast Payment
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Send USDC to up to 100 wallets.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-sm sm:text-base font-medium text-blue-400 group-hover:text-blue-300">
              <span>Start payment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </Link>

        {/* Secret Pay Card */}
        <Link href="/secret-pay" className="block group">
          <GlassCard variant="interactive" className="p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Secret Pay
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Create a private link that someone can use to claim USDC.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-sm sm:text-base font-medium text-blue-400 group-hover:text-blue-300">
              <span>Create payment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Recent activity
          </h2>
          <Link
            href="/history"
            className="text-sm font-medium text-blue-400 hover:underline"
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
