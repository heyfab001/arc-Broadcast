"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Token } from "@/types/token";
import { Recipient } from "@/types/payment";
import { BatchValidationResult } from "@/lib/validation";
import { formatAmount, truncateAddress } from "@/lib/utils";
import { ARC_TESTNET } from "@/config/chains";
import { Send, Loader2 } from "lucide-react";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm broadcast payment"
      description="Review recipients and total before signing."
      maxWidth="md"
    >
      <div className="space-y-5 pt-1 text-sm">
        {/* Breakdown Card */}
        <div className="p-4 rounded-xl bg-[#0C0D12] border border-white/[0.06] space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total amount</span>
            <span className="font-mono font-bold text-white text-base sm:text-lg">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Recipients</span>
            <span className="font-mono font-semibold text-white">{validation.recipientCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Network</span>
            <span className="text-white font-medium">{ARC_TESTNET.name}</span>
          </div>
        </div>

        {/* Recipients Mini List */}
        <div className="space-y-1.5">
          <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Recipients ({recipients.length})
          </span>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0C0D12] divide-y divide-white/[0.04]">
            {recipients.map((r, i) => (
              <div key={r.id} className="p-3 flex justify-between items-center font-mono text-xs sm:text-sm">
                <span className="text-slate-300">
                  {i + 1}. {truncateAddress(r.address, 6)}
                </span>
                <span className="text-white font-semibold">
                  {r.amount} {token.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isBroadcasting}
            className="h-11 px-4 text-sm font-medium"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirmBroadcast}
            disabled={isBroadcasting}
            isLoading={isBroadcasting}
            leftIcon={isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            className="h-11 px-6 text-sm font-semibold"
          >
            {isBroadcasting ? "Sending..." : "Send payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
