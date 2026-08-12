"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { HistoryFilterTabs } from "@/components/history/HistoryFilterTabs";
import { ActivityTable } from "@/components/history/ActivityTable";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { Button } from "@/components/ui/Button";
import { Search, RefreshCw, Check, X, AlertTriangle } from "lucide-react";

export default function HistoryPage() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    transactions,
    isLoading,
    isRefreshing,
    error,
    refresh,
    rawTransactionsCount,
  } = usePaymentHistory();

  const [justUpdated, setJustUpdated] = useState(false);

  const handleManualRefresh = async () => {
    await refresh();
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Payment History"
        subtitle="Immutable ledger of your batch disbursements and private secret claims on Arc Testnet."
        badge="Live Arc Ledger"
      />

      {/* Main Glass Container */}
      <GlassCard variant="default" className="p-4 sm:p-6 space-y-6">
        {/* Controls Bar: Responsive Tabs, Search, and Refresh */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <HistoryFilterTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />

          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            {/* Search Field with Instant Local Filter & Clear Button */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tx, claim ID, address..."
                className="w-full h-10 bg-[#090C16] border border-white/[0.08] rounded-xl pl-9 pr-8 text-xs text-white placeholder-slate-500 outline-none focus:border-arc-500 focus:ring-1 focus:ring-arc-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 p-1 text-slate-500 hover:text-white rounded hover:bg-white/[0.08] transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Refresh Button with Active / Updated Feedback */}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleManualRefresh}
              disabled={isLoading || isRefreshing}
              leftIcon={
                justUpdated ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-arc-400" : ""}`} />
                )
              }
              className="h-10 text-xs shrink-0 px-3.5 border-white/[0.08] hover:border-arc-500/40 font-medium transition-all"
            >
              {justUpdated ? (
                <span className="text-emerald-400 font-semibold">Updated</span>
              ) : isRefreshing ? (
                <span>Refreshing...</span>
              ) : (
                <span>Refresh</span>
              )}
            </Button>
          </div>
        </div>

        {/* Non-blocking Background Refresh Warning (if error occurs while data is already loaded) */}
        {error && transactions.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Could not refresh the latest blocks. Displaying previous ledger state.</span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="underline text-amber-400 hover:text-amber-300 font-medium ml-3 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Activity Table & Responsive Cards */}
        <ActivityTable
          transactions={transactions}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
          hasSearchQuery={Boolean(searchQuery.trim())}
          totalRawCount={rawTransactionsCount}
          onRetry={handleManualRefresh}
        />
      </GlassCard>
    </div>
  );
}
