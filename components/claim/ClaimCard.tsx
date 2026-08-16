"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useArcWallet } from "@/hooks/useArcWallet";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useClaimPayment } from "@/hooks/useClaimPayment";
import { ARC_TESTNET } from "@/config/chains";
import {
  Wallet,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  ShieldX,
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
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="w-full max-w-md mx-auto space-y-4">
        <GlassCard
          variant="default"
          className="p-6 text-center space-y-5 relative overflow-hidden"
        >
          {/* Header Icon */}
          {step === "CLAIMED" ? (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : step === "EXPIRED" ? (
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Clock className="w-6 h-6" />
            </div>
          ) : step === "INVALID" ? (
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <ShieldX className="w-6 h-6" />
            </div>
          ) : null}

          {/* Title and Subtitle */}
          {step === "CLAIMED" ? (
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Payment claimed
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Funds have been sent to your wallet.
              </p>
            </div>
          ) : step === "REFUNDED" ? (
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Payment refunded
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Funds were returned to the sender.
              </p>
            </div>
          ) : step === "EXPIRED" ? (
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Payment expired
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                This claim has passed its expiration date.
              </p>
            </div>
          ) : step === "INVALID" ? (
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Payment not found
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                No active payment found for this link.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                You&apos;ve received a payment.
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Connect your wallet to claim tokens on Arc.
              </p>
            </div>
          )}

          {/* Amount Display */}
          <div className="p-4 rounded-xl bg-[#080B15] border border-white/[0.08] text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Amount
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              {step === "LOADING_CLAIM" ? (
                <Loader2 className="w-6 h-6 animate-spin text-arc-400" />
              ) : claimData ? (
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {claimData.formattedAmount} <span className="text-base text-arc-300 font-sans font-semibold">USDC</span>
                </span>
              ) : (
                <span className="text-2xl font-bold text-slate-500 font-mono">
                  0.00 USDC
                </span>
              )}
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Status</span>
              <div className="mt-1 flex justify-center">
                {step === "CLAIMED" ? (
                  <StatusBadge status="claimed" />
                ) : step === "EXPIRED" ? (
                  <StatusBadge status="expired" />
                ) : step === "REFUNDED" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 font-medium">
                    Refunded
                  </span>
                ) : step === "INVALID" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">
                    Invalid
                  </span>
                ) : (
                  <StatusBadge status="available" />
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Expires</span>
              <span className="mt-1 block font-medium text-slate-200">
                {claimData ? formatExpiryTime(claimData.expiry) : "..."}
              </span>
            </div>
          </div>

          {/* Secret Missing Alert */}
          {claimData && !secretKey && step === "CLAIM_AVAILABLE" && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Secret code is missing from this link. Please ask the sender for the complete link.
              </p>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-left">
              {errorMessage}
            </div>
          )}

          {/* Explorer Links */}
          {claimTxHash && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-300">Transaction</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${claimTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{claimTxHash.slice(0, 6)}...{claimTxHash.slice(-4)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {refundTxHash && (
            <div className="p-2.5 rounded-xl bg-arc-600/10 border border-arc-500/20 flex items-center justify-between text-xs">
              <span className="text-arc-300">Refund</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${refundTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-arc-400 hover:underline flex items-center gap-1"
              >
                <span>{refundTxHash.slice(0, 6)}...{refundTxHash.slice(-4)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Action Buttons */}
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
          ) : step === "CLAIM_AVAILABLE" ? (
            <Button
              variant="primary"
              size="md"
              onClick={claimPayment}
              disabled={!isSecretValid || isClaimingProcessing}
              isLoading={isClaimingProcessing}
              className="w-full text-xs font-semibold shadow-arc-glow"
            >
              {isClaimingProcessing ? "Claiming..." : "Claim Payment"}
            </Button>
          ) : step === "EXPIRED" && isSender ? (
            <Button
              variant="primary"
              size="md"
              onClick={refundPayment}
              disabled={isRefundingProcessing}
              isLoading={isRefundingProcessing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-none"
            >
              {isRefundingProcessing ? "Refunding..." : "Refund Expired Payment"}
            </Button>
          ) : step === "CLAIMED" ? (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 font-mono">
              Claimed by: {claimData?.claimedBy || userAddress}
            </div>
          ) : (
            <Button
              variant="outline"
              size="md"
              onClick={refreshClaim}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="w-full text-xs"
            >
              Refresh Status
            </Button>
          )}
        </GlassCard>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
