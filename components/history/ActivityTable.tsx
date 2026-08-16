"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/payment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { HistorySkeleton } from "./HistorySkeleton";
import { formatAmount, formatSmartTimestamp, truncateAddress } from "@/lib/utils";
import { ARC_TESTNET } from "@/config/chains";
import { Button } from "@/components/ui/Button";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useArcWallet } from "@/hooks/useArcWallet";
import { showToast } from "@/hooks/useToast";
import {
  ExternalLink,
  ArrowUpRight,
  KeyRound,
  Sparkles,
  Inbox,
  Wallet,
  RefreshCw,
  AlertCircle,
  Clock,
  Copy,
  Check,
  SearchX,
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
  isRefreshing,
  error,
  hasSearchQuery = false,
  totalRawCount = 0,
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
        title: "Copy Failed",
        message: "Could not copy hash.",
        type: "error",
      });
    }
  };

  const handleRowClick = (txHash?: string) => {
    if (!txHash) return;
    window.open(`${ARC_TESTNET.explorerUrl}/tx/${txHash}`, "_blank", "noopener,noreferrer");
  };

  // 1. Disconnected State
  if (!isConnected) {
    return (
      <>
        <div className="py-12 px-4 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
            <Wallet className="w-5 h-5 text-arc-400" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-white">
              Connect your wallet
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Connect your wallet to view payment activity.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsWalletModalOpen(true)}
              leftIcon={<Wallet className="w-4 h-4" />}
              className="shadow-arc-glow"
            >
              Connect Wallet
            </Button>
          </div>
        </div>

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      </>
    );
  }

  // 2. Wrong Network State
  if (isWrongNetwork) {
    return (
      <div className="py-12 px-4 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-white">
            Switch to Arc Testnet
          </h4>
          <p className="text-xs text-slate-400">
            Please switch to Arc Testnet to view your activity.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => switchToArc()}
            isLoading={isSwitching}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-none font-semibold"
          >
            Switch to Arc Testnet
          </Button>
        </div>
      </div>
    );
  }

  // 3. Initial Loading Skeleton
  if (isLoading && transactions.length === 0) {
    return <HistorySkeleton rows={4} />;
  }

  // 4. Error State
  if (error && transactions.length === 0) {
    return (
      <div className="py-12 px-4 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-white">
            Unable to load activity
          </h4>
          <p className="text-xs text-red-300 max-w-sm mx-auto">
            {error}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  // 5. Search Filter Empty State
  if (transactions.length === 0 && hasSearchQuery) {
    return (
      <EmptyState
        title="No results found"
        description="Try adjusting your search query."
        icon={<SearchX className="w-5 h-5 text-slate-500" />}
      />
    );
  }

  // 6. True Empty State
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Your payments will appear here."
        icon={<Inbox className="w-5 h-5 text-slate-500" />}
      />
    );
  }

  const typeIcons = {
    broadcast: <ArrowUpRight className="w-3.5 h-3.5 text-arc-400" />,
    secret_pay: <KeyRound className="w-3.5 h-3.5 text-arc-purple" />,
    claim: <Sparkles className="w-3.5 h-3.5 text-arc-cyan" />,
    refund: <RefreshCw className="w-3.5 h-3.5 text-purple-400" />,
  };

  const typeLabels = {
    broadcast: "Broadcast",
    secret_pay: "Secret Pay",
    claim: "Claim",
    refund: "Refund",
  };

  return (
    <div className="space-y-3">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-white/[0.08] bg-[#090C16]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-slate-300">
            {transactions.map((tx) => {
              const isCopied = copiedTxHash === tx.txHash;
              return (
                <tr
                  key={tx.id}
                  onClick={() => handleRowClick(tx.txHash)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {/* Type */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                        {typeIcons[tx.type]}
                      </div>
                      <span className="font-semibold text-white">
                        {typeLabels[tx.type]}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">
                      {formatAmount(tx.amount)} {tx.token.symbol}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {tx.type === "broadcast" && tx.recipientCount ? (
                      <span>
                        {tx.recipientCount} {tx.recipientCount === 1 ? "wallet" : "wallets"}
                      </span>
                    ) : tx.type === "secret_pay" && tx.expiryTimestamp ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{formatSmartTimestamp(tx.expiryTimestamp)}</span>
                      </span>
                    ) : tx.targetAddress ? (
                      <span>{truncateAddress(tx.targetAddress, 4)}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-400">
                    {formatSmartTimestamp(tx.timestamp)}
                  </td>

                  {/* Transaction Hash */}
                  <td className="py-3 px-4 text-right">
                    {tx.txHash ? (
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-arc-400 hover:underline">
                          {truncateAddress(tx.txHash, 4)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyHash(e, tx.txHash!)}
                          title="Copy hash"
                          className="p-1 text-slate-500 hover:text-white rounded hover:bg-white/[0.08] transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono">-</span>
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
          const isCopied = copiedTxHash === tx.txHash;
          return (
            <div
              key={tx.id}
              onClick={() => handleRowClick(tx.txHash)}
              className="p-3.5 rounded-xl border border-white/[0.08] bg-[#090C16] hover:border-arc-500/30 transition-colors space-y-2.5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                    {typeIcons[tx.type]}
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs block">
                      {typeLabels[tx.type]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatSmartTimestamp(tx.timestamp)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={tx.status} />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-xs">
                <span className="font-mono font-bold text-white">
                  {formatAmount(tx.amount)} {tx.token.symbol}
                </span>

                <span className="font-mono text-slate-400">
                  {tx.type === "broadcast" && tx.recipientCount
                    ? `${tx.recipientCount} Wallets`
                    : tx.targetAddress
                    ? truncateAddress(tx.targetAddress, 4)
                    : "-"}
                </span>
              </div>

              {tx.txHash && (
                <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">{truncateAddress(tx.txHash, 4)}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyHash(e, tx.txHash!)}
                      className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 hover:text-white text-[10px] transition-colors"
                    >
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
