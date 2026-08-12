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
  Clock,
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#8B5CF6", "#00F5D4", "#FFFFFF"],
      });
    }
  }, [isSuccess]);

  const getModalTitle = () => {
    if (isSuccess) return "Payment Sent!";
    if (isNotDeployed) return "Contract Not Deployed";
    if (isCancelled) return "Transaction Cancelled";
    if (isError) return "Transaction Failed";
    if (step === "AWAITING_APPROVAL_WALLET") return "Confirm USDC Approval";
    if (step === "AWAITING_BATCH_WALLET") return "Confirm Batch Payment";
    return "Executing Batch Payment";
  };

  const getModalDescription = () => {
    if (isSuccess) return "Disbursement confirmed on Arc Testnet.";
    if (isNotDeployed) return "The ArcBatchPayment smart contract is not yet deployed on Arc Testnet.";
    if (isCancelled) return "The transaction was cancelled in your wallet.";
    if (isError) return "An error occurred during transaction execution.";
    if (step === "AWAITING_APPROVAL_WALLET") return "Please approve the USDC allowance in your connected wallet.";
    if (step === "AWAITING_BATCH_WALLET") return "Please confirm the batch payment in your connected wallet.";
    return "Communicating with Arc Testnet blockchain...";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => {}}
      title={getModalTitle()}
      description={getModalDescription()}
      maxWidth="lg"
    >
      <div className="space-y-5 pt-2">
        {/* Contract Not Deployed Notice */}
        {isNotDeployed && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Contract Deployment Required
              </h4>
              <p className="text-xs text-amber-200 mt-1.5 max-w-md mx-auto leading-relaxed">
                {error || "Batch payment contract is not deployed. Deploy ArcBatchPayment to Arc Testnet and set NEXT_PUBLIC_ARC_BATCH_PAYMENT_ADDRESS."}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] text-left text-xs font-mono space-y-1.5 text-slate-300">
              <span className="text-[11px] text-slate-500 block">Deploy Command:</span>
              <code className="text-[11px] text-arc-300 block break-all">
                forge script script/DeployArcBatchPayment.s.sol:DeployArcBatchPayment --rpc-url https://rpc.testnet.arc.network --broadcast --legacy
              </code>
            </div>

            <Button variant="primary" size="md" onClick={onClose} className="w-full text-xs font-semibold">
              Dismiss
            </Button>
          </div>
        )}

        {/* Success Card */}
        {isSuccess && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Payment Sent Successfully!
              </h4>
              <p className="text-xs text-emerald-300/90 mt-1 font-mono">
                Disbursed {totalAmount} {tokenSymbol} to {recipientCount} recipient{recipientCount === 1 ? "" : "s"}
              </p>
            </div>

            {batchTxHash && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs space-y-2 text-left">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Batch Transaction Hash:</span>
                  <span className="font-mono text-white text-[11px]">
                    {truncateAddress(batchTxHash, 8)}
                  </span>
                </div>
                <div className="flex justify-end pt-1">
                  <a
                    href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arc-500/20 hover:bg-arc-500/30 text-arc-300 font-semibold text-xs transition-colors border border-arc-500/30"
                  >
                    View on ArcScan
                    <ExternalLink className="w-3.5 h-3.5" />
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

        {/* Cancelled State */}
        {isCancelled && (
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-white/[0.08] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-700/30 border border-white/[0.1] flex items-center justify-center text-slate-400 mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Transaction Cancelled
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                The transaction confirmation was rejected in your wallet. No funds were transferred.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Error Card */}
        {isError && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Transaction Failed
              </h4>
              <p className="text-xs text-red-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                {error || "An error occurred while communicating with Arc Testnet."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* In-Progress Real-Time Stepper */}
        {!isSuccess && !isError && !isCancelled && !isNotDeployed && (
          <div className="space-y-4">
            {/* Step 1: Token Approval */}
            <div className="p-4 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-arc-purple/10 border border-arc-purple/20 flex items-center justify-center text-arc-purple">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      1. USDC Allowance Approval
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Authorizes batch disbursement of {totalAmount} {tokenSymbol}
                    </span>
                  </div>
                </div>

                {step === "AWAITING_APPROVAL_WALLET" ? (
                  <span className="text-xs font-semibold text-amber-400 animate-pulse flex items-center gap-1.5 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Waiting for wallet confirmation
                  </span>
                ) : step === "APPROVAL_SUBMITTED" || step === "WAITING_APPROVAL_CONFIRMATION" ? (
                  <span className="text-xs font-semibold text-arc-400 animate-pulse flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Confirming on Arc...
                  </span>
                ) : approvalTxHash || step === "AWAITING_BATCH_WALLET" || step === "BATCH_SUBMITTED" || step === "WAITING_BATCH_CONFIRMATION" ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">Checking</span>
                )}
              </div>

              {approvalTxHash && (
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                  <span>Approval Tx:</span>
                  <a
                    href={`${ARC_TESTNET.explorerUrl}/tx/${approvalTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {truncateAddress(approvalTxHash, 6)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Step 2: Batch Execution */}
            <div className="p-4 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-arc-500/10 border border-arc-500/20 flex items-center justify-center text-arc-400">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      2. Execute Batch Transfer
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Disburses {totalAmount} {tokenSymbol} to {recipientCount} wallets
                    </span>
                  </div>
                </div>

                {step === "AWAITING_BATCH_WALLET" ? (
                  <span className="text-xs font-semibold text-amber-400 animate-pulse flex items-center gap-1.5 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Waiting for wallet confirmation
                  </span>
                ) : step === "BATCH_SUBMITTED" || step === "WAITING_BATCH_CONFIRMATION" ? (
                  <span className="text-xs font-semibold text-arc-400 animate-pulse flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Confirming on Arc...
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">Pending</span>
                )}
              </div>

              {batchTxHash && (
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                  <span>Batch Tx:</span>
                  <a
                    href={`${ARC_TESTNET.explorerUrl}/tx/${batchTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {truncateAddress(batchTxHash, 6)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Live Status Indicator */}
            <div className="p-3.5 rounded-xl bg-arc-500/10 border border-arc-500/25 flex items-center justify-center gap-2.5 text-xs font-medium text-arc-300">
              <Loader2 className="w-4 h-4 animate-spin text-arc-400" />
              <span className="font-semibold">{statusText}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
