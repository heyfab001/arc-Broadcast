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

  const getTitle = () => {
    if (isSuccess) return "Payment sent";
    if (isCancelled) return "Payment cancelled";
    if (isError) return "Payment failed";
    if (step === "AWAITING_APPROVAL_WALLET" || step === "AWAITING_BATCH_WALLET") {
      return "Confirm in wallet";
    }
    return "Ready to send";
  };

  const getDescription = () => {
    if (isSuccess) return "Payment sent successfully.";
    if (isCancelled) return "Payment was cancelled in your wallet.";
    if (isError) return "Payment failed. Please try again.";
    if (step === "AWAITING_APPROVAL_WALLET" || step === "AWAITING_BATCH_WALLET") {
      return "Confirm this payment in your wallet.";
    }
    if (step === "WAITING_APPROVAL_CONFIRMATION" || step === "WAITING_BATCH_CONFIRMATION") {
      return "Waiting for confirmation...";
    }
    return statusText || "Preparing transaction...";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      title={getTitle()}
      maxWidth="sm"
    >
      <div className="space-y-5 pt-1 text-sm">
        {/* Status Graphic */}
        <div className="py-4 text-center space-y-3">
          {isSuccess ? (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : isCancelled ? (
            <div className="w-12 h-12 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
          ) : isError ? (
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">
              {isSuccess
                ? `${totalAmount} ${tokenSymbol} sent to ${recipientCount} ${recipientCount === 1 ? "wallet" : "wallets"}`
                : isCancelled
                ? "Payment cancelled."
                : isError
                ? error || "Payment failed. Please try again."
                : getDescription()}
            </h4>
            {!isSuccess && !isCancelled && !isError && (
              <p className="text-xs sm:text-sm text-slate-400">
                {step.includes("AWAITING")
                  ? "Please check your connected wallet extension."
                  : "Blockchain confirmation in progress on Arc Testnet."}
              </p>
            )}
          </div>
        </div>

        {/* Transaction Hashes */}
        {(approvalTxHash || batchTxHash) && (
          <div className="p-3.5 rounded-xl bg-[#0C0D12] border border-white/[0.06] space-y-2 font-mono text-xs sm:text-sm">
            {approvalTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Approval:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${approvalTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>{approvalTxHash.slice(0, 6)}...{approvalTxHash.slice(-4)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
            {batchTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Broadcast:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>{batchTxHash.slice(0, 6)}...{batchTxHash.slice(-4)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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
              className="w-full h-12 text-base font-semibold"
            >
              Done
            </Button>
          ) : isCancelled || isError ? (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                className="flex-1 h-12 text-base font-semibold"
              >
                Close
              </Button>
              {onRetry && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onRetry}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  className="flex-1 h-12 text-base font-semibold"
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
