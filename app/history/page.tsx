"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { HistoryFilterTabs } from "@/components/history/HistoryFilterTabs";
import { ActivityTable } from "@/components/history/ActivityTable";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/hooks/useToast";
import { Search, RefreshCw, X } from "lucide-react";

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

  const handleManualRefresh = async () => {
    await refresh();
    showToast({
      title: "Activity updated",
      message: "Latest transactions loaded.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <PageHeader
        title="Activity"
        subtitle="Your recent payments."
      />

      {/* Main Container */}
      <GlassCard variant="default" className="p-5 sm:p-6 space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <HistoryFilterTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payments..."
                className="w-full h-11 bg-[#0C0D12] border border-white/15 rounded-lg pl-9 pr-8 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-3 p-1 text-slate-400 hover:text-white rounded"
                  aria-label="Clear search"
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
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
              }
              className="h-11 text-sm font-medium shrink-0 px-4"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

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
