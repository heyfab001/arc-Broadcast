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
import { Send, AlertTriangle, Wallet, RefreshCw, Loader2 } from "lucide-react";

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
        return "Confirm approval in wallet";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL_CONFIRMATION":
        return "Waiting for confirmation...";
      case "AWAITING_BATCH_WALLET":
        return "Confirm in your wallet";
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
        return "Send Payment";
    }
  };

  return (
    <>
      <GlassCard variant="default" className="space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-semibold text-white">
            Payment Summary
          </h3>
          <span className="text-xs text-slate-400 font-mono">{ARC_TESTNET.name}</span>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipients</span>
            <span className="font-semibold text-white font-mono">
              {validation.recipientCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network</span>
            <span className="font-medium text-white">
              {ARC_TESTNET.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estimated fee</span>
            <span className="font-mono text-slate-300">
              Calculated in wallet
            </span>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Total</span>
            <span className="text-base font-bold text-white font-mono">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validation.errors.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Review before sending:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
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
            size="md"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4" />}
            className="w-full text-xs font-semibold shadow-arc-glow"
          >
            Connect Wallet
          </Button>
        ) : isWrongNetwork ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => switchToArc()}
            isLoading={isSwitching}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-none"
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
            leftIcon={
              isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
            className="w-full text-xs font-semibold shadow-arc-glow"
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
