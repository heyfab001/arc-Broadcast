"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CreatedSecretClaim } from "@/hooks/useSecretPayExecution";
import { ARC_TESTNET } from "@/config/chains";
import {
  Check,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import { showToast } from "@/hooks/useToast";

export interface SecretPayCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: CreatedSecretClaim | null;
}

export function SecretPayCreatedModal({
  isOpen,
  onClose,
  claim,
}: SecretPayCreatedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !claim) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(claim.claimUrl);
      setCopied(true);
      showToast({
        title: "Link copied",
        message: "Share this link with the recipient.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        title: "Copy failed",
        message: "Please manually copy the link.",
        type: "error",
      });
    }
  };

  const txUrl = `${ARC_TESTNET.explorerUrl}/tx/${claim.depositTxHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
      <div className="w-full max-w-lg relative animate-fade-in">
        <GlassCard
          variant="default"
          className="p-6 sm:p-7 space-y-5 relative shadow-modal"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Payment ready
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Share this link with the recipient.
            </p>
          </div>

          {/* Link Box */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                readOnly
                value={claim.claimUrl}
                className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-3.5 text-base text-gray-900 font-mono select-all outline-none font-medium"
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                className="h-12 shrink-0 text-base font-semibold px-5 min-w-[150px]"
              >
                {copied ? "Link copied" : "Copy claim link"}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-base bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="font-mono font-bold text-gray-900">{claim.amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Expires in</span>
              <span className="font-semibold text-gray-900">{claim.expiryDays} {claim.expiryDays === 1 ? "day" : "days"}</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Transaction</span>
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:underline flex items-center gap-1.5 font-semibold text-sm"
              >
                <span>{claim.depositTxHash.slice(0, 6)}...{claim.depositTxHash.slice(-4)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="w-full h-12 text-base font-semibold"
          >
            Done
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
