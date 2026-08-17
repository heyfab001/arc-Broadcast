"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TokenSelector } from "@/components/common/TokenSelector";
import { AmountInput } from "@/components/common/AmountInput";
import { Button } from "@/components/ui/Button";
import { Token } from "@/types/token";
import { CLAIM_EXPIRY_OPTIONS } from "@/config/constants";
import { useArcWallet } from "@/hooks/useArcWallet";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useSecretPayExecution } from "@/hooks/useSecretPayExecution";
import { SecretPayCreatedModal } from "./SecretPayCreatedModal";
import { Wallet, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SecretPayFormProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  amount: string;
  onChangeAmount: (val: string) => void;
  expiryDays: number;
  onChangeExpiry: (val: number) => void;
  message: string;
  onChangeMessage: (val: string) => void;
  error?: string | null;
  canCreate: boolean;
  userBalance?: number;
}

export function SecretPayForm({
  selectedToken,
  onSelectToken,
  amount,
  onChangeAmount,
  expiryDays,
  onChangeExpiry,
  message,
  onChangeMessage,
  error,
  canCreate,
  userBalance = 0,
}: SecretPayFormProps) {
  const { isConnected, isWrongNetwork, isSwitching, switchToArc, balanceUSDC } = useArcWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const {
    step,
    createdClaim,
    errorMessage,
    createSecretPayment,
    reset,
    isProcessing,
  } = useSecretPayExecution();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }
    if (isWrongNetwork) {
      switchToArc();
      return;
    }
    if (!canCreate || isProcessing) return;

    await createSecretPayment(amount, expiryDays, message);
  };

  const getStepButtonLabel = () => {
    switch (step) {
      case "CHECKING_BALANCE":
      case "CHECKING_ALLOWANCE":
        return "Creating payment...";
      case "AWAITING_APPROVAL":
      case "AWAITING_DEPOSIT":
        return "Confirm in your wallet";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL":
      case "DEPOSIT_SUBMITTED":
      case "WAITING_DEPOSIT":
        return "Confirming...";
      default:
        return "Create payment";
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <GlassCard variant="default" className="space-y-5 p-6 sm:p-7">
          {/* Amount & Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-gray-900">Amount</label>
              <span className="text-gray-500">
                Balance:{" "}
                <span className="font-mono text-gray-900 font-semibold">
                  {isConnected ? `${balanceUSDC} ${selectedToken.symbol}` : "Not connected"}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <TokenSelector
                  selectedToken={selectedToken}
                  onSelectToken={onSelectToken}
                />
              </div>
              <div className="sm:col-span-8">
                <AmountInput
                  value={amount}
                  onChange={onChangeAmount}
                  maxBalance={userBalance}
                  symbol={selectedToken.symbol}
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Expiry
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CLAIM_EXPIRY_OPTIONS.map((opt) => {
                const isSelected = expiryDays === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onChangeExpiry(opt.value)}
                    className={cn(
                      "h-11 px-3 rounded-lg border text-sm font-medium transition-colors text-center shadow-2xs",
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-600 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
                      isProcessing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Message (optional)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              disabled={isProcessing}
              placeholder="Add a note (optional)"
              maxLength={120}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {!isConnected ? (
              <Button
                type="button"
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
                type="button"
                variant="primary"
                size="md"
                onClick={() => switchToArc()}
                isLoading={isSwitching}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-none"
              >
                Switch to Arc Testnet
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!canCreate || isProcessing}
                isLoading={isProcessing}
                leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                className="w-full h-12 text-base font-semibold"
              >
                {getStepButtonLabel()}
              </Button>
            )}
          </div>
        </GlassCard>
      </form>

      {/* Created Modal */}
      <SecretPayCreatedModal
        isOpen={Boolean(createdClaim)}
        onClose={reset}
        claim={createdClaim}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
