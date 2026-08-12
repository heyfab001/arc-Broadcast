"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Token } from "@/types/token";
import { BatchValidationResult } from "@/lib/validation";
import { formatAmount } from "@/lib/utils";
import { useArcWallet } from "@/hooks/useArcWallet";
import { WalletModal } from "@/components/wallet/WalletModal";
import { BroadcastPaymentStep } from "@/hooks/useBroadcastPayment";
import { Send, AlertTriangle, Info, ShieldCheck, Wallet, RefreshCw, Loader2 } from "lucide-react";

export interface TransactionSummaryProps {
  token: Token;
  validation: BatchValidationResult;
  canSubmit: boolean;
  onPreviewOrSend: () => void;
  isProcessing?: boolean;
  paymentStep?: BroadcastPaymentStep;
}

export function TransactionSummary({
  token,
  validation,
  canSubmit,
  onPreviewOrSend,
  isProcessing = false,
  paymentStep = "IDLE",
}: TransactionSummaryProps) {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc } = useArcWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Dynamic button label based on real payment step
  const getButtonLabel = () => {
    switch (paymentStep) {
      case "CHECKING_BALANCE":
      case "CHECKING_ALLOWANCE":
        return "Checking allowance...";
      case "AWAITING_APPROVAL_WALLET":
        return "Approve USDC";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL_CONFIRMATION":
        return "Waiting for approval...";
      case "AWAITING_BATCH_WALLET":
        return "Sending batch payment...";
      case "BATCH_SUBMITTED":
      case "WAITING_BATCH_CONFIRMATION":
        return "Confirming transaction...";
      case "SUCCESS":
        return "Payment Sent";
      case "NOT_DEPLOYED":
        return "Contract Not Deployed";
      case "CANCELLED":
        return "Transaction Cancelled";
      case "ERROR":
        return "Transaction Failed";
      default:
        return `Send Batch Payment (${validation.recipientCount})`;
    }
  };

  return (
    <>
      <GlassCard variant="glow" glowColor="blue" className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-arc-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Transaction Summary
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Arc Testnet</span>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipients</span>
            <span className="font-semibold text-white font-mono">
              {validation.recipientCount} wallet{validation.recipientCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Total Amount</span>
            <div className="text-right">
              <span className="font-semibold text-white font-mono text-base">
                {formatAmount(validation.totalAmount)} {token.symbol}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              Estimated Network Fee
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <span className="text-xs font-mono text-arc-300 bg-arc-500/10 px-2 py-0.5 rounded border border-arc-500/20">
              Calculated by wallet
            </span>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-sm font-bold text-white">Estimated Total</span>
            <span className="text-lg font-bold text-arc-400 font-mono">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validation.errors.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Attention needed before broadcast:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/90 pl-1">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Action Button */}
        {!isConnected ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="w-full text-sm font-semibold tracking-wide shadow-arc-glow-lg"
          >
            Connect Wallet to continue
          </Button>
        ) : isWrongNetwork ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => switchToArc()}
            isLoading={isSwitching}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-none"
          >
            Switch to Arc Testnet
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onPreviewOrSend}
            disabled={!canSubmit || isProcessing}
            isLoading={isProcessing}
            leftIcon={
              isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
            className="w-full text-sm font-semibold tracking-wide shadow-arc-glow-lg"
          >
            {getButtonLabel()}
          </Button>
        )}

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Batch payments are executed through the ArcBatchPayment protocol on Arc Testnet.
        </p>
      </GlassCard>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
