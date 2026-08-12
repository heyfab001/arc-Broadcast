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
  Sparkles,
  ShieldCheck,
  Wallet,
  Clock,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  ArrowRight,
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
      <div className="w-full max-w-lg mx-auto space-y-6">
        <GlassCard
          variant="glow"
          glowColor={step === "CLAIMED" ? "purple" : step === "EXPIRED" ? "purple" : "cyan"}
          className="p-6 sm:p-8 text-center relative overflow-hidden"
        >
          {/* Glow backdrop */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-arc-cyan/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          {step === "CLAIMED" ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : step === "EXPIRED" ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5">
              <Clock className="w-8 h-8" />
            </div>
          ) : step === "INVALID" ? (
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-5">
              <ShieldX className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-arc-cyan/20 to-arc-600/20 border border-arc-cyan/30 flex items-center justify-center text-arc-cyan mx-auto mb-5 shadow-[0_0_30px_-5px_rgba(0,245,212,0.3)]">
              <Sparkles className="w-8 h-8" />
            </div>
          )}

          {/* Title and description */}
          {step === "CLAIMED" ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Payment Successfully Claimed!
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                The USDC tokens have been deposited directly to the recipient&apos;s wallet on Arc Testnet.
              </p>
            </>
          ) : step === "REFUNDED" ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Payment Refunded
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                This expired claim deposit has been refunded back to the original sender.
              </p>
            </>
          ) : step === "EXPIRED" ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                This Payment Has Expired
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                The claim period has ended. The original sender can now reclaim their deposited tokens.
              </p>
            </>
          ) : step === "INVALID" ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Claim Not Found
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                No active secret payment exists for this Claim ID on Arc Testnet.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Someone sent you a private payment.
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Locked in the Arc smart contract escrow. Connect your wallet to claim the USDC.
              </p>
            </>
          )}

          {/* Amount Display */}
          <div className="my-6 p-5 rounded-2xl bg-[#080B15]/90 border border-white/[0.08] relative overflow-hidden">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payment Amount
            </div>
            <div className="flex items-center justify-center gap-2">
              {step === "LOADING_CLAIM" ? (
                <Loader2 className="w-8 h-8 animate-spin text-arc-400" />
              ) : claimData ? (
                <>
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {claimData.formattedAmount}
                  </span>
                  <span className="text-sm font-semibold text-arc-300 font-mono bg-arc-500/15 px-2 py-0.5 rounded border border-arc-500/30">
                    USDC
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-slate-500 font-mono">
                  0.00 USDC
                </span>
              )}
            </div>
            {claimData && (
              <p className="text-[11px] text-slate-500 mt-1">
                Sender: {claimData.sender.slice(0, 6)}...{claimData.sender.slice(-4)}
              </p>
            )}
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-6">
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
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Network</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-semibold text-slate-200">
                <Globe className="w-3.5 h-3.5 text-arc-400" />
                <span>{ARC_TESTNET.shortName}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Expiry</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-semibold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{claimData ? formatExpiryTime(claimData.expiry) : "..."}</span>
              </div>
            </div>
          </div>

          {/* Secret Missing Alert */}
          {claimData && !secretKey && step === "CLAIM_AVAILABLE" && (
            <div className="p-3.5 mb-5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                The private secret code is missing from this claim URL (#fragment). Please use the complete claim link provided by the sender.
              </p>
            </div>
          )}

          {/* Secret Invalid Alert */}
          {claimData && secretKey && !isSecretValid && step === "CLAIM_AVAILABLE" && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-300 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                The secret code in this URL does not match the on-chain cryptographic commitment.
              </p>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-left">
              {errorMessage}
            </div>
          )}

          {/* ArcScan Tx Links */}
          {claimTxHash && (
            <div className="p-3 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-300">Claim Confirmed:</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${claimTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>{claimTxHash.slice(0, 8)}...{claimTxHash.slice(-6)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {refundTxHash && (
            <div className="p-3 mb-5 rounded-xl bg-arc-600/10 border border-arc-500/20 flex items-center justify-between text-xs">
              <span className="text-arc-300">Refund Confirmed:</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${refundTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-arc-400 hover:text-arc-300 flex items-center gap-1"
              >
                <span>{refundTxHash.slice(0, 8)}...{refundTxHash.slice(-6)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Action Buttons */}
          {!isConnected ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsWalletModalOpen(true)}
              leftIcon={<Wallet className="w-4 h-4" />}
              className="w-full text-sm font-semibold shadow-arc-glow-lg"
            >
              Connect Wallet to Claim
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
          ) : step === "CLAIM_AVAILABLE" ? (
            <Button
              variant="primary"
              size="lg"
              onClick={claimPayment}
              disabled={!isSecretValid || isClaimingProcessing}
              isLoading={isClaimingProcessing}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="w-full text-sm font-semibold shadow-arc-glow-lg bg-gradient-to-r from-arc-cyan to-arc-600 text-slate-950 font-bold"
            >
              {isClaimingProcessing
                ? "Confirming Claim on Arc..."
                : "Claim Payment to My Wallet"}
            </Button>
          ) : step === "EXPIRED" && isSender ? (
            <Button
              variant="primary"
              size="lg"
              onClick={refundPayment}
              disabled={isRefundingProcessing}
              isLoading={isRefundingProcessing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full text-sm font-semibold shadow-arc-glow-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              {isRefundingProcessing
                ? "Refunding Escrow..."
                : "Refund Expired Deposit to My Wallet"}
            </Button>
          ) : step === "CLAIMED" ? (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300">
              Claim settled on-chain to receiver wallet:
              <span className="block font-mono text-arc-cyan mt-1">
                {claimData?.claimedBy || userAddress}
              </span>
            </div>
          ) : step === "REFUNDED" ? (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300">
              Escrow deposit refunded to original sender:
              <span className="block font-mono text-arc-cyan mt-1">
                {claimData?.sender}
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={refreshClaim}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full text-xs font-medium"
            >
              Refresh Claim Status
            </Button>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span>Claim ID:</span>
            <span className="text-slate-400 truncate max-w-[200px]">{claimId}</span>
          </div>
        </GlassCard>

        {/* Security explanation */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-arc-cyan shrink-0" />
          <p className="leading-relaxed">
            No registration needed. Funds are disbursed on Arc Testnet directly from the escrow contract to whichever EVM address signs the claim.
          </p>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
