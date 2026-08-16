"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useArcWallet } from "@/hooks/useArcWallet";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useClaimPayment } from "@/hooks/useClaimPayment";
import { ARC_TESTNET } from "@/config/chains";
import {
  Wallet,
  RefreshCw,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export interface ClaimCardProps {
  claimId: string;
}

export function ClaimCard({ claimId }: ClaimCardProps) {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc, address: userAddress } = useArcWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const {
    step,
    claimData,
    secretKey,
    isSecretValid,
    claimTxHash,
    refundTxHash,
    errorMessage,
    isSender,
    claimPayment,
    refundPayment,
    refreshClaim,
  } = useClaimPayment(claimId);

  const formatExpiryTime = (expiryBigInt: bigint) => {
    const date = new Date(Number(expiryBigInt) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isClaimingProcessing =
    step === "AWAITING_CLAIM_WALLET" ||
    step === "CLAIM_SUBMITTED" ||
    step === "WAITING_CLAIM";

  const isRefundingProcessing =
    step === "AWAITING_REFUND_WALLET" ||
    step === "REFUND_SUBMITTED" ||
    step === "WAITING_REFUND";

  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <GlassCard
          variant="default"
          className="p-6 text-center space-y-4"
        >
          {/* Label */}
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Secret payment
          </span>

          {/* Amount */}
          <div className="py-2">
            {step === "LOADING_CLAIM" ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
            ) : claimData ? (
              <span className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight block">
                {claimData.formattedAmount} <span className="text-lg font-sans font-medium text-slate-300">USDC</span>
              </span>
            ) : (
              <span className="text-3xl font-bold text-slate-500 font-mono block">
                0.00 USDC
              </span>
            )}
          </div>

          {/* Description */}
          {step === "CLAIMED" ? (
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-emerald-400">
                Payment claimed
              </h2>
              <p className="text-xs text-slate-400">
                Funds have been sent to your wallet.
              </p>
            </div>
          ) : step === "REFUNDED" ? (
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-300">
                Payment refunded
              </h2>
              <p className="text-xs text-slate-400">
                Returned to sender.
              </p>
            </div>
          ) : step === "EXPIRED" ? (
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-amber-400">
                Payment expired
              </h2>
              <p className="text-xs text-slate-400">
                This claim has expired.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Sent to whoever claims this payment.
            </p>
          )}

          {/* Expiry line */}
          {claimData && step !== "CLAIMED" && step !== "REFUNDED" && (
            <div className="text-[11px] text-slate-500">
              Expires {formatExpiryTime(claimData.expiry)}
            </div>
          )}

          {/* Secret Missing / Invalid Alerts */}
          {claimData && !secretKey && step === "CLAIM_AVAILABLE" && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-1.5 text-left">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Secret code missing from link.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-left">
              {errorMessage}
            </div>
          )}

          {/* Transaction Links */}
          {claimTxHash && (
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-400">Transaction</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${claimTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{claimTxHash.slice(0, 6)}...</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
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
            ) : step === "CLAIM_AVAILABLE" ? (
              <Button
                variant="primary"
                size="md"
                onClick={claimPayment}
                disabled={!isSecretValid || isClaimingProcessing}
                isLoading={isClaimingProcessing}
                className="w-full"
              >
                {isClaimingProcessing ? "Claiming..." : "Claim payment"}
              </Button>
            ) : step === "EXPIRED" && isSender ? (
              <Button
                variant="primary"
                size="md"
                onClick={refundPayment}
                disabled={isRefundingProcessing}
                isLoading={isRefundingProcessing}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                {isRefundingProcessing ? "Refunding..." : "Refund payment"}
              </Button>
            ) : step === "CLAIMED" ? (
              <div className="p-2.5 rounded-lg bg-[#0C0D12] text-xs text-slate-400 font-mono">
                Claimed by: {claimData?.claimedBy || userAddress}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshClaim}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="w-full"
              >
                Refresh
              </Button>
            )}
          </div>
        </GlassCard>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
