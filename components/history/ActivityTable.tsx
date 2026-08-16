"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/payment";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
  Loader2,
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
        message: "Hash copied to clipboard.",
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
        <div className="py-8 text-center space-y-2 border border-dashed border-white/[0.06] rounded-lg">
          <p className="text-xs text-slate-400">Connect your wallet to view activity.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
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
      <div className="py-8 text-center space-y-2 border border-dashed border-white/[0.06] rounded-lg">
        <p className="text-xs text-amber-300">Wrong network.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => switchToArc()}
          isLoading={isSwitching}
          leftIcon={<RefreshCw className="w-3 h-3" />}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950"
        >
          Switch to Arc Testnet
        </Button>
      </div>
    );
  }

  // 3. Loading
  if (isLoading && transactions.length === 0) {
    return (
      <div className="py-8 flex items-center justify-center text-xs text-slate-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        <span>Loading activity...</span>
      </div>
    );
  }

  // 4. Error
  if (error && transactions.length === 0) {
    return (
      <div className="py-8 text-center space-y-2 border border-dashed border-white/[0.06] rounded-lg">
        <p className="text-xs text-red-400">Unable to load activity.</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3 h-3" />}
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
      <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-lg">
        <p className="text-xs text-slate-400">
          {hasSearchQuery ? "No matching activity found." : "No activity yet."}
        </p>
      </div>
    );
  }

  const typeLabels = {
    broadcast: "Broadcast",
    secret_pay: "Secret Pay",
    claim: "Claim",
    refund: "Refund",
  };

  return (
    <div className="space-y-2">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-hidden rounded-lg border border-white/[0.08] bg-[#0C0D12]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/[0.06] bg-white/[0.01] text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3.5">Type</th>
              <th className="py-2.5 px-3.5">Amount</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5">Date</th>
              <th className="py-2.5 px-3.5 text-right">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-slate-300">
            {transactions.map((tx) => {
              const isCopied = copiedTxHash === tx.txHash;
              return (
                <tr
                  key={tx.id}
                  onClick={() => handleRowClick(tx.txHash)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {/* Type */}
                  <td className="py-2.5 px-3.5 font-medium text-white">
                    {typeLabels[tx.type]}
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-3.5 font-mono font-medium text-white">
                    {formatAmount(tx.amount)} {tx.token.symbol}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3.5">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Date */}
                  <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                    {formatSmartTimestamp(tx.timestamp)}
                  </td>

                  {/* Hash */}
                  <td className="py-2.5 px-3.5 text-right">
                    {tx.txHash ? (
                      <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <span className="text-blue-400 hover:underline">
                          {truncateAddress(tx.txHash, 4)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyHash(e, tx.txHash!)}
                          title="Copy hash"
                          className="p-1 text-slate-500 hover:text-white rounded"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
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

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-2">
        {transactions.map((tx) => {
          return (
            <div
              key={tx.id}
              onClick={() => handleRowClick(tx.txHash)}
              className="p-3 rounded-lg border border-white/[0.08] bg-[#0C0D12] space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white">
                  {typeLabels[tx.type]}
                </span>
                <StatusBadge status={tx.status} />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-white">
                  {formatAmount(tx.amount)} {tx.token.symbol}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatSmartTimestamp(tx.timestamp)}
                </span>
              </div>

              {tx.txHash && (
                <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{truncateAddress(tx.txHash, 4)}</span>
                  <span className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>ArcScan</span>
                    <ExternalLink className="w-3 h-3" />
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
