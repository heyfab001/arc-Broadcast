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
        return "Verifying Escrow...";
      case "AWAITING_APPROVAL":
        return "Confirm USDC Approval in Wallet...";
      case "APPROVAL_SUBMITTED":
      case "WAITING_APPROVAL":
        return "Confirming Approval on Arc...";
      case "AWAITING_DEPOSIT":
        return "Confirm Deposit in Wallet...";
      case "DEPOSIT_SUBMITTED":
      case "WAITING_DEPOSIT":
        return "Locking Escrow on Arc Testnet...";
      default:
        return "Create Secret Payment";
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <GlassCard variant="glow" glowColor="purple" className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-arc-purple/15 border border-arc-purple/30 flex items-center justify-center text-arc-purple">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Deposit & Create Secret Claim
                </h3>
                <p className="text-xs text-slate-400">
                  Lock tokens in cryptographic escrow on Arc Testnet until claimed by receiver
                </p>
              </div>
            </div>
          </div>

          {/* Token and Amount Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-slate-300">Deposit Token & Amount</label>
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
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Claim Expiry Duration
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
                      "py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center",
                      isSelected
                        ? "bg-gradient-to-r from-arc-600 to-arc-purple text-white border-arc-400 shadow-md shadow-arc-600/20"
                        : "bg-[#090C16] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20",
                      isProcessing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Unclaimed deposits can be refunded back to the sender after expiration.
            </p>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Optional Private Memo / Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              disabled={isProcessing}
              placeholder="e.g., Payment for freelance design work or bounty reward"
              maxLength={120}
              className="w-full h-11 bg-[#090C16] border border-white/[0.08] rounded-xl px-3.5 text-xs text-white placeholder-slate-600 outline-none focus:border-arc-500 focus:ring-1 focus:ring-arc-500/30 disabled:opacity-50"
            />
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Progress Banner during Multi-step execution */}
          {isProcessing && (
            <div className="p-3.5 rounded-xl bg-arc-600/10 border border-arc-500/30 flex items-center gap-3 text-xs text-arc-200">
              <Loader2 className="w-4 h-4 animate-spin text-arc-400 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-semibold block">{getStepButtonLabel()}</span>
                <span className="text-[11px] text-slate-400">
                  Please approve wallet prompts to lock your escrow deposit on Arc Testnet.
                </span>
              </div>
            </div>
          )}

          {/* Action Button Gated on Real Wallet State */}
          {!isConnected ? (
            <Button
              type="button"
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
              type="button"
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
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canCreate || isProcessing}
              isLoading={isProcessing}
              leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              className="w-full text-sm font-semibold tracking-wide shadow-arc-glow-lg"
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
