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
      <div className="space-y-5 pt-1 text-base">
        {/* Breakdown Card */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total amount</span>
            <span className="font-mono font-bold text-gray-900 text-xl">
              {formatAmount(validation.totalAmount)} {token.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Recipients</span>
            <span className="font-mono font-semibold text-gray-900 text-base">{validation.recipientCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Network</span>
            <span className="text-gray-900 font-semibold text-base">{ARC_TESTNET.name}</span>
          </div>
        </div>

        {/* Recipients Mini List */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Recipients ({recipients.length})
          </span>
          <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {recipients.map((r, i) => (
              <div key={r.id} className="p-3.5 flex justify-between items-center font-mono text-base">
                <span className="text-gray-800 font-medium">
                  {i + 1}. {truncateAddress(r.address, 6)}
                </span>
                <span className="text-gray-900 font-bold">
                  {r.amount} {token.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isBroadcasting}
            className="h-12 px-5 text-base font-semibold"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirmBroadcast}
            disabled={isBroadcasting}
            isLoading={isBroadcasting}
            leftIcon={isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            className="h-12 px-6 text-base font-semibold"
          >
            {isBroadcasting ? "Sending..." : "Send payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
