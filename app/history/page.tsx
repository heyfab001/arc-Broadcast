"use client";

import React, { useState } from "react";
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
    <div className="space-y-5 animate-fade-in max-w-5xl">
      {/* Header */}
      <PageHeader
        title="Activity"
        subtitle="Your recent payments."
      />

      {/* Main Container */}
      <GlassCard variant="default" className="p-4 sm:p-5 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <HistoryFilterTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-8 bg-[#0C0D12] border border-white/10 rounded-lg pl-8 pr-6 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 p-0.5 text-slate-500 hover:text-white rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
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
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
              }
              className="h-8 text-xs shrink-0 px-2.5"
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
