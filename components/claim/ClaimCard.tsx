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
      <div className="w-full max-w-md mx-auto">
        <GlassCard
          variant="default"
          className="p-7 sm:p-8 text-center space-y-6"
        >
          {/* Small Label */}
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 block">
            Secret payment
          </span>

          {/* Large Amount */}
          <div className="py-2">
            {step === "LOADING_CLAIM" ? (
              <Loader2 className="w-9 h-9 animate-spin text-blue-600 mx-auto" />
            ) : claimData ? (
              <span className="text-4xl sm:text-5xl font-bold text-gray-900 font-mono tracking-tight block">
                {claimData.formattedAmount} <span className="text-2xl font-sans font-medium text-gray-600">USDC</span>
              </span>
            ) : (
              <span className="text-4xl font-bold text-gray-400 font-mono block">
                0.00 USDC
              </span>
            )}
          </div>

          {/* Subtitle / Status Text */}
          {step === "CLAIMED" ? (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-emerald-700">
                Payment claimed
              </h2>
              <p className="text-base text-gray-600">
                USDC has been sent to your wallet.
              </p>
            </div>
          ) : step === "REFUNDED" ? (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-700">
                Payment refunded
              </h2>
              <p className="text-base text-gray-500">
                Returned to sender.
              </p>
            </div>
          ) : step === "EXPIRED" ? (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-amber-800">
                Payment expired
              </h2>
              <p className="text-base text-gray-600">
                This claim has expired.
              </p>
            </div>
          ) : (
            <p className="text-base text-gray-600 font-medium">
              Someone sent you a payment.
            </p>
          )}

          {/* Expiry line */}
          {claimData && step !== "CLAIMED" && step !== "REFUNDED" && (
            <div className="text-sm text-gray-500 font-medium">
              Expires {formatExpiryTime(claimData.expiry)}
            </div>
          )}

          {/* Secret Missing Alert */}
          {claimData && !secretKey && step === "CLAIM_AVAILABLE" && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-base text-amber-800 flex items-start gap-2.5 text-left font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <span>Secret code missing from link.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-base text-red-700 text-left font-medium">
              {errorMessage}
            </div>
          )}

          {/* Transaction Links */}
          {claimTxHash && (
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base">
              <span className="text-gray-500 font-medium">Transaction</span>
              <a
                href={`${ARC_TESTNET.explorerUrl}/tx/${claimTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:underline flex items-center gap-1.5 font-semibold text-sm"
              >
                <span>{claimTxHash.slice(0, 6)}...{claimTxHash.slice(-4)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
                leftIcon={<Wallet className="w-5 h-5" />}
                className="w-full h-12 text-base font-semibold"
              >
                Connect wallet to claim
              </Button>
            ) : isWrongNetwork ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => switchToArc()}
                isLoading={isSwitching}
                leftIcon={<RefreshCw className="w-5 h-5" />}
                className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-none"
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
                className="w-full h-12 text-base font-semibold"
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
                className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-none"
              >
                {isRefundingProcessing ? "Refunding..." : "Refund payment"}
              </Button>
            ) : step === "CLAIMED" ? (
              <div className="p-4 rounded-xl bg-gray-50 text-base text-gray-800 font-mono border border-gray-200 font-medium">
                Claimed by: {claimData?.claimedBy || userAddress}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshClaim}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full h-12 text-base font-semibold"
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
