"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { Transaction } from "@/types/payment";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { fetchUserOnChainHistory, getCachedUserHistory } from "@/services/paymentHistory";

export type HistoryTab = "all" | "broadcast" | "secret_pay" | "claim";

export function usePaymentHistory() {
  const { address: userAddress, isConnected, chainId } = useAccount();

  const [activeTab, setActiveTab] = useState<HistoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Instant initial load from in-memory cache if available
  const initialCache = userAddress ? getCachedUserHistory(userAddress) : null;
  const [transactions, setTransactions] = useState<Transaction[]>(initialCache?.transactions || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCache && Boolean(isConnected && userAddress));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBatchDeployed, setIsBatchDeployed] = useState(true);
  const [isSecretDeployed, setIsSecretDeployed] = useState(true);

  const isWrongNetwork = Boolean(isConnected && chainId !== ARC_TESTNET_CHAIN.id);
  const isFetchingRef = useRef(false);

  const loadHistory = useCallback(
    async (showFullLoading = false, bypassCache = false) => {
      if (!isConnected || !userAddress || isWrongNetwork) {
        setTransactions([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      // Only show full loading if there are no existing transactions
      if (showFullLoading && transactions.length === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const result = await fetchUserOnChainHistory(userAddress, bypassCache);
        setTransactions(result.transactions);
        setIsBatchDeployed(result.isBatchDeployed);
        setIsSecretDeployed(result.isSecretDeployed);
      } catch (err: any) {
        setError(err?.message || "Failed to query on-chain history.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [isConnected, userAddress, isWrongNetwork, transactions.length]
  );

  // Initial load on wallet connect / address change
  useEffect(() => {
    if (userAddress && isConnected && !isWrongNetwork) {
      const cached = getCachedUserHistory(userAddress);
      if (cached) {
        setTransactions(cached.transactions);
        setIsLoading(false);
        // Refresh quietly in the background
        loadHistory(false, false);
      } else {
        loadHistory(true, true);
      }
    }
  }, [userAddress, isConnected, isWrongNetwork]);

  // Auto-refresh every 60 seconds only when tab is visible
  useEffect(() => {
    if (!isConnected || isWrongNetwork || !userAddress) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadHistory(false, true);
      }
    }, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadHistory(false, false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected, isWrongNetwork, userAddress, loadHistory]);

  // Filter by Tab and Search Query entirely locally with 0 latency
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Tab filter
      if (activeTab === "broadcast" && tx.type !== "broadcast") return false;
      if (activeTab === "secret_pay" && tx.type !== "secret_pay" && tx.type !== "refund") return false;
      if (activeTab === "claim" && tx.type !== "claim") return false;

      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(q);
        const matchesTx = tx.txHash ? tx.txHash.toLowerCase().includes(q) : false;
        const matchesClaim = tx.claimId ? tx.claimId.toLowerCase().includes(q) : false;
        const matchesBatch = tx.batchId ? tx.batchId.toLowerCase().includes(q) : false;
        const matchesSender = tx.senderAddress ? tx.senderAddress.toLowerCase().includes(q) : false;
        const matchesTarget = tx.targetAddress ? tx.targetAddress.toLowerCase().includes(q) : false;

        return matchesId || matchesTx || matchesClaim || matchesBatch || matchesSender || matchesTarget;
      }

      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    transactions: filteredTransactions,
    rawTransactionsCount: transactions.length,
    isLoading,
    isRefreshing,
    error,
    isBatchDeployed,
    isSecretDeployed,
    isConnected,
    isWrongNetwork,
    refresh: () => loadHistory(false, true),
    isEmpty: !isLoading && filteredTransactions.length === 0,
  };
}
