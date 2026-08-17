"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/payment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HistorySkeleton } from "./HistorySkeleton";
import { formatAmount, formatSmartTimestamp, truncateAddress } from "@/lib/utils";
import { ARC_TESTNET } from "@/config/chains";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useArcWallet } from "@/hooks/useArcWallet";
import { showToast } from "@/hooks/useToast";
import {
  ExternalLink,
  Wallet,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

export interface ActivityTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing?: boolean;
  error?: string | null;
  hasSearchQuery?: boolean;
  totalRawCount?: number;
  onRetry?: () => void;
}

export function ActivityTable({
  transactions,
  isLoading,
  error,
  hasSearchQuery = false,
  onRetry,
}: ActivityTableProps) {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc } = useArcWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState<string | null>(null);

  const handleCopyHash = async (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedTxHash(hash);
      showToast({
        title: "Copied",
        message: "Transaction hash copied.",
        type: "success",
      });
      setTimeout(() => setCopiedTxHash(null), 2000);
    } catch {
      showToast({
        title: "Copy failed",
        message: "Could not copy hash.",
        type: "error",
      });
    }
  };

  const handleRowClick = (txHash?: string) => {
    if (!txHash) return;
    window.open(`${ARC_TESTNET.explorerUrl}/tx/${txHash}`, "_blank", "noopener,noreferrer");
  };

  // 1. Disconnected
  if (!isConnected) {
    return (
      <>
        <div className="py-10 text-center space-y-3 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-base text-gray-600">Connect your wallet to view activity.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="h-11 px-5 text-sm font-semibold"
          >
            Connect wallet
          </Button>
        </div>

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      </>
    );
  }

  // 2. Wrong Network
  if (isWrongNetwork) {
    return (
      <div className="py-10 text-center space-y-3 border border-dashed border-amber-300 rounded-xl bg-amber-50">
        <p className="text-base text-amber-800 font-medium">Wrong network.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="h-11 px-5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-none"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  // 3. Loading Skeletons
  if (isLoading && transactions.length === 0) {
    return <HistorySkeleton rows={3} />;
  }

  // 4. Error
  if (error && transactions.length === 0) {
    return (
      <div className="py-10 text-center space-y-3 border border-dashed border-red-300 rounded-xl bg-red-50">
        <p className="text-sm text-red-700 font-medium">Unable to load activity.</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="h-10 px-4 text-sm"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  // 5. Empty
  if (transactions.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
        <p className="text-base text-gray-500">
          {hasSearchQuery ? "No matching activity found." : "No activity yet."}
        </p>
      </div>
    );
  }

  const typeLabels = {
    broadcast: "Broadcast payment",
    secret_pay: "Secret Pay",
    claim: "Claim payment",
    refund: "Refund payment",
  };

  return (
    <div className="space-y-3">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Recipients / Target</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {transactions.map((tx) => {
              const isCopied = copiedTxHash === tx.txHash;
              return (
                <tr
                  key={tx.id}
                  onClick={() => handleRowClick(tx.txHash)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  {/* Type */}
                  <td className="py-4 px-4 font-semibold text-gray-900 text-base">
                    {typeLabels[tx.type]}
                  </td>

                  {/* Recipients / Target */}
                  <td className="py-4 px-4 font-mono text-xs sm:text-sm text-gray-600">
                    {tx.type === "broadcast" && tx.recipientCount
                      ? `${tx.recipientCount} ${tx.recipientCount === 1 ? "recipient" : "recipients"}`
                      : tx.targetAddress
                      ? truncateAddress(tx.targetAddress, 4)
                      : "Private claim"}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 font-mono font-bold text-gray-900 text-base">
                    {formatAmount(tx.amount)} {tx.token.symbol}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-gray-500 text-xs sm:text-sm">
                    {formatSmartTimestamp(tx.timestamp)}
                  </td>

                  {/* Hash */}
                  <td className="py-4 px-4 text-right">
                    {tx.txHash ? (
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm">
                        <span className="text-blue-600 hover:underline font-medium">
                          {truncateAddress(tx.txHash, 4)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyHash(e, tx.txHash!)}
                          title="Copy hash"
                          aria-label="Copy transaction hash"
                          className="p-1 text-gray-400 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ) : (
                      <span className="text-gray-400 font-mono">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden space-y-2.5">
        {transactions.map((tx) => {
          return (
            <div
              key={tx.id}
              onClick={() => handleRowClick(tx.txHash)}
              className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-base">
                  {typeLabels[tx.type]}
                </span>
                <StatusBadge status={tx.status} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-mono font-bold text-gray-900 text-base">
                  {formatAmount(tx.amount)} {tx.token.symbol}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {tx.type === "broadcast" && tx.recipientCount
                    ? `${tx.recipientCount} recipients`
                    : formatSmartTimestamp(tx.timestamp)}
                </span>
              </div>

              {tx.txHash && (
                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-mono text-gray-600">
                  <span>{truncateAddress(tx.txHash, 4)}</span>
                  <span className="text-blue-600 hover:underline flex items-center gap-1 font-sans font-medium">
                    <span>ArcScan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
