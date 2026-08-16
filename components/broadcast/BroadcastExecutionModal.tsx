"use client";

import React, { useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BroadcastPaymentStep } from "@/hooks/useBroadcastPayment";
import { ARC_TESTNET } from "@/config/chains";
import { truncateAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  Send,
  KeyRound,
  RotateCcw,
  AlertTriangle,
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
  onRetry: () => void;
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
  const isNotDeployed = step === "NOT_DEPLOYED";
  const canClose = isSuccess || isError || isCancelled || isNotDeployed;

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#8B5CF6", "#00F5D4", "#FFFFFF"],
      });
    }
  }, [isSuccess]);

  const getModalTitle = () => {
    if (isSuccess) return "Payment sent";
    if (isNotDeployed) return "Contract not deployed";
    if (isCancelled) return "Transaction cancelled";
    if (isError) return "Transaction failed";
    if (step === "AWAITING_APPROVAL_WALLET") return "Confirm approval";
    if (step === "AWAITING_BATCH_WALLET") return "Confirm in your wallet";
    return "Processing payment";
  };

  const getModalDescription = () => {
    if (isSuccess) return "Funds have been sent to recipients on Arc Testnet.";
    if (isNotDeployed) return "Contract is not deployed on Arc Testnet.";
    if (isCancelled) return "The transaction was cancelled in your wallet.";
    if (isError) return error || "Transaction failed. Please try again.";
    if (step === "AWAITING_APPROVAL_WALLET") return "Confirm the approval in your wallet to proceed.";
    if (step === "AWAITING_BATCH_WALLET") return "Confirm the payment transaction in your wallet.";
    return "Waiting for confirmation...";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => {}}
      title={getModalTitle()}
      description={getModalDescription()}
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        {/* Success View */}
        {isSuccess && (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Payment sent
              </h4>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Sent {totalAmount} {tokenSymbol} to {recipientCount} {recipientCount === 1 ? "wallet" : "wallets"}
              </p>
            </div>

            {batchTxHash && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs space-y-2 text-left">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Transaction:</span>
                  <span className="font-mono text-white text-[11px]">
                    {truncateAddress(batchTxHash, 8)}
                  </span>
                </div>
                <div className="flex justify-end pt-1">
                  <a
                    href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-arc-500/20 hover:bg-arc-500/30 text-arc-300 font-medium text-xs transition-colors"
                  >
                    View on ArcScan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full text-xs font-semibold"
            >
              Done
            </Button>
          </div>
        )}

        {/* Cancelled View */}
        {isCancelled && (
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Transaction cancelled
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                No funds were sent.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Error View */}
        {isError && (
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/25 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Transaction failed
              </h4>
              <p className="text-xs text-red-300 mt-1 max-w-sm mx-auto leading-relaxed">
                {error || "Transaction failed. Please try again."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* In-Progress Stepper */}
        {!isSuccess && !isError && !isCancelled && !isNotDeployed && (
          <div className="space-y-3">
            {/* Step 1: Token Approval */}
            <div className="p-3.5 rounded-xl bg-[#090C16] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">1. USDC Approval</span>
                  <span className="text-[11px] text-slate-400">{totalAmount} {tokenSymbol}</span>
                </div>
              </div>

              {step === "AWAITING_APPROVAL_WALLET" ? (
                <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Confirm in wallet
                </span>
              ) : step === "APPROVAL_SUBMITTED" || step === "WAITING_APPROVAL_CONFIRMATION" ? (
                <span className="text-xs font-medium text-arc-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Confirming...
                </span>
              ) : approvalTxHash || step === "AWAITING_BATCH_WALLET" || step === "BATCH_SUBMITTED" || step === "WAITING_BATCH_CONFIRMATION" ? (
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approved
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Checking</span>
              )}
            </div>

            {/* Step 2: Batch Execution */}
            <div className="p-3.5 rounded-xl bg-[#090C16] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">2. Send Payment</span>
                  <span className="text-[11px] text-slate-400">{recipientCount} {recipientCount === 1 ? "wallet" : "wallets"}</span>
                </div>
              </div>

              {step === "AWAITING_BATCH_WALLET" ? (
                <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Confirm in wallet
                </span>
              ) : step === "BATCH_SUBMITTED" || step === "WAITING_BATCH_CONFIRMATION" ? (
                <span className="text-xs font-medium text-arc-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Confirming...
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Pending</span>
              )}
            </div>

            {/* Status indicator */}
            <div className="p-3 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center gap-2 text-xs text-arc-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-arc-400" />
              <span>{statusText}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
