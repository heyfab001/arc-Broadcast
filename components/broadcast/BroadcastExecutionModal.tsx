"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BroadcastPaymentStep } from "@/hooks/useBroadcastPayment";
import { ARC_TESTNET } from "@/config/chains";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

export interface BroadcastExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: BroadcastPaymentStep;
  statusText: string;
  approvalTxHash: string | null;
  batchTxHash: string | null;
  error: string | null;
  recipientCount: number;
  totalAmount: string;
  tokenSymbol: string;
  onRetry?: () => void;
}

export function BroadcastExecutionModal({
  isOpen,
  onClose,
  step,
  statusText,
  approvalTxHash,
  batchTxHash,
  error,
  recipientCount,
  totalAmount,
  tokenSymbol,
  onRetry,
}: BroadcastExecutionModalProps) {
  const isSuccess = step === "SUCCESS";
  const isError = step === "ERROR";
  const isCancelled = step === "CANCELLED";
  const isProcessing = !isSuccess && !isError && !isCancelled && step !== "IDLE";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      title={
        isSuccess
          ? "Payment sent"
          : isCancelled
          ? "Transaction cancelled"
          : isError
          ? "Transaction failed"
          : "Sending payment"
      }
      description={
        isSuccess
          ? "Tokens have been transferred to all recipient wallets."
          : undefined
      }
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1 text-xs">
        {/* Status Graphic / Indicator */}
        <div className="py-4 text-center space-y-2">
          {isSuccess ? (
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : isCancelled ? (
            <div className="w-10 h-10 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 mx-auto">
              <XCircle className="w-5 h-5" />
            </div>
          ) : isError ? (
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-white">
              {isSuccess
                ? `${totalAmount} ${tokenSymbol} sent to ${recipientCount} ${recipientCount === 1 ? "wallet" : "wallets"}`
                : isCancelled
                ? "Transaction was cancelled in your wallet."
                : isError
                ? error || "Transaction failed. Please try again."
                : statusText || "Processing transaction..."}
            </h4>
          </div>
        </div>

        {/* Transaction Hashes */}
        {(approvalTxHash || batchTxHash) && (
          <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-1.5 font-mono text-[11px]">
            {approvalTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Approval:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${approvalTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{approvalTxHash.slice(0, 6)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {batchTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{batchTxHash.slice(0, 6)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2">
          {isSuccess ? (
            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full"
            >
              Done
            </Button>
          ) : isCancelled || isError ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              {onRetry && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onRetry}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Try again
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="w-full text-slate-500 opacity-60"
            >
              Please wait...
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
