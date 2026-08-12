"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { Transaction } from "@/types/payment";
import { ARC_TESTNET_CHAIN } from "@/config/chains";
import { fetchUserOnChainHistory } from "@/services/paymentHistory";

export type HistoryTab = "all" | "broadcast" | "secret_pay" | "claim";

export function usePaymentHistory() {
  const { address: userAddress, isConnected, chainId } = useAccount();

  const [activeTab, setActiveTab] = useState<HistoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBatchDeployed, setIsBatchDeployed] = useState(true);
  const [isSecretDeployed, setIsSecretDeployed] = useState(true);

  const isWrongNetwork = Boolean(isConnected && chainId !== ARC_TESTNET_CHAIN.id);
  const isFetchingRef = useRef(false);

  const loadHistory = useCallback(
    async (showLoadingSpinner = true) => {
      if (!isConnected || !userAddress || isWrongNetwork) {
        setTransactions([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (showLoadingSpinner) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        console.log(`[HISTORY HOOK] Fetching on-chain history for ${userAddress}...`);
        const result = await fetchUserOnChainHistory(userAddress);
        setTransactions(result.transactions);
        setIsBatchDeployed(result.isBatchDeployed);
        setIsSecretDeployed(result.isSecretDeployed);
        console.log(`[HISTORY HOOK] Loaded ${result.transactions.length} transactions.`);
      } catch (err: any) {
        console.error("[HISTORY HOOK] Error querying on-chain history:", err);
        setError(err?.message || "Failed to query on-chain history from Arc Testnet.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [isConnected, userAddress, isWrongNetwork]
  );

  // Initial load on wallet connect or network change
  useEffect(() => {
    loadHistory(true);
  }, [loadHistory]);

  // Auto-refresh every 45s when page is active
  useEffect(() => {
    if (!isConnected || isWrongNetwork) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadHistory(false);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [isConnected, isWrongNetwork, loadHistory]);

  // Filter by Tab and Search Query
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Tab filter
      if (activeTab === "broadcast" && tx.type !== "broadcast") return false;
      if (activeTab === "secret_pay" && tx.type !== "secret_pay" && tx.type !== "refund") return false;
      if (activeTab === "claim" && tx.type !== "claim") return false;

      // Search filter
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
    refresh: () => loadHistory(false),
    isEmpty: !isLoading && filteredTransactions.length === 0,
  };
}
