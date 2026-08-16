"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Token } from "@/types/token";
import { Recipient } from "@/types/payment";
import { BatchValidationResult } from "@/lib/validation";
import { truncateAddress, formatAmount } from "@/lib/utils";
import { ARC_TESTNET } from "@/config/chains";
import { CONTRACTS } from "@/config/contracts";
import { checkAllowance, toAtomicAmount, getUsdcDecimals } from "@/services/broadcastPayment";
import { useAccount } from "wagmi";
import { Send, CheckCircle2, Clock } from "lucide-react";

export interface BroadcastPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  recipients: Recipient[];
  validation: BatchValidationResult;
  onConfirmBroadcast: () => void;
  isBroadcasting?: boolean;
}

export function BroadcastPreviewModal({
  isOpen,
  onClose,
  token,
  recipients,
  validation,
  onConfirmBroadcast,
  isBroadcasting = false,
}: BroadcastPreviewModalProps) {
  const { address } = useAccount();
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState<boolean | null>(null);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);

  useEffect(() => {
    async function checkCurrentApproval() {
      if (!address || !isOpen || !CONTRACTS.arcTestnet.batchPayment) {
        setIsAllowanceSufficient(null);
        return;
      }
      setIsCheckingAllowance(true);
      try {
        const decimals = await getUsdcDecimals(CONTRACTS.arcTestnet.usdc);
        const totalAtomic = toAtomicAmount(validation.totalAmount.toString(), decimals);
        const currentAllowance = await checkAllowance(
          address,
          CONTRACTS.arcTestnet.batchPayment,
          CONTRACTS.arcTestnet.usdc
        );
        setIsAllowanceSufficient(currentAllowance >= totalAtomic);
      } catch (err) {
        console.warn("[Preview] Allowance check error:", err);
        setIsAllowanceSufficient(false);
      } finally {
        setIsCheckingAllowance(false);
      }
    }

    checkCurrentApproval();
  }, [address, isOpen, validation.totalAmount]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Payment"
      description="Check details before confirming in your wallet."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Metric Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-[11px] text-slate-400 block">Recipients</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">
              {validation.recipientCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-[11px] text-slate-400 block">Total</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-[11px] text-slate-400 block">Approval</span>
            <span className="text-xs font-medium mt-1 block">
              {isCheckingAllowance ? (
                <span className="text-slate-400">Checking...</span>
              ) : isAllowanceSufficient ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Approved
                </span>
              ) : (
                <span className="text-amber-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Required
                </span>
              )}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-[11px] text-slate-400 block">Network</span>
            <span className="text-xs font-semibold text-white mt-1 block">
              {ARC_TESTNET.name}
            </span>
          </div>
        </div>

        {/* Itemized Recipients List */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 block">
            Recipients
          </span>
          <div className="max-h-48 overflow-y-auto space-y-1 bg-[#080B14] p-2 rounded-xl border border-white/[0.06] scrollbar-thin">
            {recipients.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px]">#{i + 1}</span>
                  <span className="font-mono text-slate-300">
                    {truncateAddress(r.address, 6)}
                  </span>
                </div>
                <span className="font-mono font-semibold text-white">
                  {formatAmount(r.amount)} {token.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Network Fee */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-slate-400">Estimated network fee</span>
          <span className="font-mono text-slate-300">
            Calculated in wallet
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isBroadcasting}>
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirmBroadcast}
            isLoading={isBroadcasting}
            leftIcon={<Send className="w-4 h-4" />}
            className="text-xs font-semibold shadow-arc-glow"
          >
            Send Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
