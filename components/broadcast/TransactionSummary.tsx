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
        return "Confirm in wallet";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL_CONFIRMATION":
        return "Confirming...";
      case "AWAITING_BATCH_WALLET":
        return "Confirm in wallet";
      case "BATCH_SUBMITTED":
      case "WAITING_BATCH_CONFIRMATION":
        return "Confirming...";
      case "SUCCESS":
        return "Payment sent";
      case "CANCELLED":
      case "ERROR":
        return "Try again";
      default:
        return "Send payment";
    }
  };

  return (
    <>
      <GlassCard variant="default" className="space-y-5 p-5 sm:p-6">
        <div className="pb-4 border-b border-white/[0.06]">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            3. Review
          </h3>
          <span className="text-xs sm:text-sm text-slate-400 mt-0.5 block">
            Payment summary
          </span>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipients</span>
            <span className="font-mono font-semibold text-white">
              {validation.recipientCount} {validation.recipientCount === 1 ? "recipient" : "recipients"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network</span>
            <span className="text-white font-medium">
              {ARC_TESTNET.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estimated fee</span>
            <span className="text-slate-300">
              Calculated in wallet
            </span>
          </div>

          <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-200 font-medium">Total</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validation.errors.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Please review:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-200/90 pl-1">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          {!isConnected ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsWalletModalOpen(true)}
              leftIcon={<Wallet className="w-4 h-4" />}
              className="w-full h-12 text-base font-semibold"
            >
              Connect wallet
            </Button>
          ) : isWrongNetwork ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => switchToArc()}
              isLoading={isSwitching}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950"
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
              leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              className="w-full h-12 text-base font-semibold"
            >
              {getButtonLabel()}
            </Button>
          )}
        </div>
      </GlassCard>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
