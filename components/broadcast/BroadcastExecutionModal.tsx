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
      <div className="space-y-5 pt-1 text-base">
        {/* Status Graphic */}
        <div className="py-4 text-center space-y-3">
          {isSuccess ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          ) : isCancelled ? (
            <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 mx-auto">
              <XCircle className="w-7 h-7" />
            </div>
          ) : isError ? (
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          )}

          <div className="space-y-1.5">
            <h4 className="text-lg font-semibold text-gray-900 leading-snug">
              {isSuccess
                ? `${totalAmount} ${tokenSymbol} sent to ${recipientCount} ${recipientCount === 1 ? "wallet" : "wallets"}`
                : isCancelled
                ? "Payment cancelled."
                : isError
                ? error || "Payment failed. Please try again."
                : getDescription()}
            </h4>
            {!isSuccess && !isCancelled && !isError && (
              <p className="text-sm text-gray-500">
                {step.includes("AWAITING")
                  ? "Please check your connected wallet extension."
                  : "Blockchain confirmation in progress on Arc Testnet."}
              </p>
            )}
          </div>
        </div>

        {/* Transaction Hashes */}
        {(approvalTxHash || batchTxHash) && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 font-mono text-sm">
            {approvalTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans text-sm">Approval:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${approvalTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-mono font-medium text-sm"
                >
                  <span>{approvalTxHash.slice(0, 6)}...{approvalTxHash.slice(-4)}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
            {batchTxHash && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans text-sm">Broadcast:</span>
                <a
                  href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-mono font-medium text-sm"
                >
                  <span>{batchTxHash.slice(0, 6)}...{batchTxHash.slice(-4)}</span>
                  <ExternalLink className="w-4 h-4" />
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
              size="md"
              disabled
              className="w-full text-gray-400 opacity-60 text-base"
            >
              Please wait...
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
