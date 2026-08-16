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
import { ARC_TESTNET } from "@/config/chains";
import { AlertTriangle, Wallet, RefreshCw, Loader2 } from "lucide-react";

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

  const getButtonLabel = () => {
    switch (paymentStep) {
      case "CHECKING_BALANCE":
      case "CHECKING_ALLOWANCE":
        return "Preparing...";
      case "AWAITING_APPROVAL_WALLET":
        return "Confirm approval";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL_CONFIRMATION":
        return "Waiting for confirmation...";
      case "AWAITING_BATCH_WALLET":
        return "Confirm in wallet";
      case "BATCH_SUBMITTED":
      case "WAITING_BATCH_CONFIRMATION":
        return "Waiting for confirmation...";
      case "SUCCESS":
        return "Payment sent";
      case "CANCELLED":
        return "Transaction cancelled";
      case "ERROR":
        return "Transaction failed";
      default:
        return "Send payment";
    }
  };

  return (
    <>
      <GlassCard variant="default" className="space-y-4 p-4 sm:p-5">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">
            Payment summary
          </h3>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipients</span>
            <span className="font-mono font-medium text-white">
              {validation.recipientCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network</span>
            <span className="text-white">
              {ARC_TESTNET.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Fee</span>
            <span className="text-slate-300">
              Calculated in wallet
            </span>
          </div>

          <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-300 font-medium">Total</span>
            <span className="text-sm font-bold text-white font-mono">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validation.errors.length > 0 && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Review items:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
            className="w-full"
          >
            Connect wallet
          </Button>
        ) : isWrongNetwork ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => switchToArc()}
            isLoading={isSwitching}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950"
          >
            Switch to Arc Testnet
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={onPreviewOrSend}
            disabled={!canSubmit || isProcessing}
            isLoading={isProcessing}
            leftIcon={isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
            className="w-full"
          >
            {getButtonLabel()}
          </Button>
        )}
      </GlassCard>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
