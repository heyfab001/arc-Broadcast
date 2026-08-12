"use client";

import { useState, useMemo } from "react";
import { Transaction, PaymentType } from "@/types/payment";

export type HistoryTab = "all" | "broadcast" | "secret_pay" | "claim";

export function useHistory() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Transactions remain empty as no fake transactions are fabricated
  const [transactions] = useState<Transaction[]>([]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (activeTab !== "all" && tx.type !== activeTab) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          tx.id.toLowerCase().includes(q) ||
          tx.token.symbol.toLowerCase().includes(q) ||
          (tx.targetAddress && tx.targetAddress.toLowerCase().includes(q)) ||
          (tx.txHash && tx.txHash.toLowerCase().includes(q))
        );
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
    totalCount: transactions.length,
    isEmpty: transactions.length === 0,
  };
}
