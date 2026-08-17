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
      <div className="pb-5 border-b border-gray-200 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 leading-tight">
          Send USDC on Arc
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Send to multiple wallets or create a private claim link.
        </p>
      </div>

      {/* Two Primary Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Broadcast Payment Card */}
        <Link href="/broadcast" className="block group">
          <GlassCard variant="interactive" className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Send className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Broadcast Payment
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  Send USDC to up to 100 wallets.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-base font-medium text-blue-600 group-hover:text-blue-700">
              <span>Start payment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </Link>

        {/* Secret Pay Card */}
        <Link href="/secret-pay" className="block group">
          <GlassCard variant="interactive" className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <KeyRound className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Secret Pay
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  Create a private link to send USDC.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-base font-medium text-blue-600 group-hover:text-blue-700">
              <span>Create payment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Recent activity
          </h2>
          <Link
            href="/history"
            className="text-sm font-medium text-blue-600 hover:underline"
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
