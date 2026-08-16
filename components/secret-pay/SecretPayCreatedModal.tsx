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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="w-full max-w-sm relative">
        <GlassCard
          variant="default"
          className="p-5 space-y-4 relative"
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Payment ready
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Share this link with the person you want to receive it.
            </p>
          </div>

          {/* Link Box */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={claim.claimUrl}
                className="w-full h-10 bg-[#0C0D12] border border-white/10 rounded-lg px-3 text-xs text-slate-300 font-mono select-all outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                className="shrink-0 text-xs px-3 min-w-[120px]"
              >
                {copied ? "Link copied" : "Copy claim link"}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs bg-[#0C0D12] p-3 rounded-lg border border-white/[0.06] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Amount</span>
              <span className="font-mono font-medium text-white">{claim.amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expires in</span>
              <span>{claim.expiryDays} {claim.expiryDays === 1 ? "day" : "days"}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-slate-400">Transaction</span>
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{claim.depositTxHash.slice(0, 6)}...{claim.depositTxHash.slice(-4)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="w-full"
          >
            Done
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
