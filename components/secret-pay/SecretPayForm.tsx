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
import {
  KeyRound,
  Lock,
  Clock,
  MessageSquare,
  Wallet,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
        return "Preparing...";
      case "AWAITING_APPROVAL":
        return "Confirm approval in wallet";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL":
        return "Waiting for confirmation...";
      case "AWAITING_DEPOSIT":
        return "Confirm in your wallet";
      case "DEPOSIT_SUBMITTED":
      case "WAITING_DEPOSIT":
        return "Waiting for confirmation...";
      default:
        return "Create Payment";
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <GlassCard variant="default" className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-arc-purple/15 border border-arc-purple/30 flex items-center justify-center text-arc-purple">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Create Payment
                </h3>
                <p className="text-xs text-slate-400">
                  Lock tokens and generate a private claim link.
                </p>
              </div>
            </div>
          </div>

          {/* Token and Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Token & Amount
              </label>
              <span className="text-slate-400">
                Balance:{" "}
                <span className="font-mono text-slate-200">
                  {isConnected ? `${balanceUSDC} ${selectedToken.symbol}` : "Connect Wallet"}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5">
                <TokenSelector
                  selectedToken={selectedToken}
                  onSelectToken={onSelectToken}
                />
              </div>
              <div className="sm:col-span-7">
                <AmountInput
                  value={amount}
                  onChange={onChangeAmount}
                  maxBalance={userBalance}
                  symbol={selectedToken.symbol}
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
          </div>

          {/* Expiry Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Expiry
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CLAIM_EXPIRY_OPTIONS.map((opt) => {
                const isSelected = expiryDays === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onChangeExpiry(opt.value)}
                    className={cn(
                      "py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-center",
                      isSelected
                        ? "bg-arc-600 text-white border-arc-500"
                        : "bg-[#090C16] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20",
                      isProcessing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              disabled={isProcessing}
              placeholder="Add a note (optional)"
              maxLength={120}
              className="w-full h-10 bg-[#090C16] border border-white/[0.08] rounded-xl px-3 text-xs text-white placeholder-slate-600 outline-none focus:border-arc-500 disabled:opacity-50"
            />
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Action Button */}
          {!isConnected ? (
            <Button
              type="button"
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
              type="button"
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
              type="submit"
              variant="primary"
              size="md"
              disabled={!canCreate || isProcessing}
              isLoading={isProcessing}
              leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              className="w-full text-xs font-semibold shadow-arc-glow"
            >
              {getStepButtonLabel()}
            </Button>
          )}
        </GlassCard>
      </form>

      {/* Claim Created Modal */}
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
