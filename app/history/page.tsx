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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Activity"
        subtitle="Your payments and claims."
      />

      {/* Main Container */}
      <GlassCard variant="default" className="p-4 sm:p-6 space-y-5">
        {/* Controls Bar: Tabs, Search, Refresh */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <HistoryFilterTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />

          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions"
                className="w-full h-9 bg-[#090C16] border border-white/[0.08] rounded-xl pl-8 pr-7 text-xs text-white placeholder-slate-500 outline-none focus:border-arc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 p-0.5 text-slate-500 hover:text-white rounded transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isLoading || isRefreshing}
              leftIcon={
                justUpdated ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-arc-400" : ""}`} />
                )
              }
              className="h-9 text-xs shrink-0 px-3"
            >
              {justUpdated ? "Updated" : isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Warning if refresh fails while data exists */}
        {error && transactions.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Could not fetch latest updates.</span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="underline text-amber-400 hover:text-amber-300 font-medium ml-2 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Activity Table */}
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
