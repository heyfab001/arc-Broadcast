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
      <div className="space-y-4 pt-1 text-xs">
        {/* Breakdown Card */}
        <div className="p-3 rounded-lg bg-[#0C0D12] border border-white/[0.06] space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Total amount</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Recipients</span>
            <span className="font-mono text-white">{validation.recipientCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Network</span>
            <span className="text-white">{ARC_TESTNET.name}</span>
          </div>
        </div>

        {/* Recipients Mini List */}
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Recipients ({recipients.length})
          </span>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-white/[0.06] bg-[#0C0D12] divide-y divide-white/[0.04]">
            {recipients.map((r, i) => (
              <div key={r.id} className="p-2 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">
                  {i + 1}. {truncateAddress(r.address, 6)}
                </span>
                <span className="text-white font-medium">
                  {r.amount} {token.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isBroadcasting}
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
            leftIcon={isBroadcasting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          >
            {isBroadcasting ? "Sending..." : "Send payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
