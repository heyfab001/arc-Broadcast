"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CreatedSecretClaim } from "@/hooks/useSecretPayExecution";
import { ARC_TESTNET } from "@/config/chains";
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Coins,
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
        title: "Link Copied",
        message: "Claim link copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast({
        title: "Copy Failed",
        message: "Please manually copy the link.",
        type: "error",
      });
    }
  };

  const txUrl = `${ARC_TESTNET.explorerUrl}/tx/${claim.depositTxHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md relative">
        <GlassCard
          variant="default"
          className="p-6 space-y-5 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Payment created
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Share this link with the recipient.
            </p>
          </div>

          {/* Claim Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Claim link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={claim.claimUrl}
                className="w-full h-10 bg-[#090C16] border border-white/[0.08] rounded-xl px-3 text-xs text-slate-300 font-mono select-all outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                className="shrink-0 h-10 px-3.5 shadow-arc-glow text-xs"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Summary Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Amount
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 font-bold text-white">
                <Coins className="w-3.5 h-3.5 text-arc-400" />
                <span>{claim.amount} USDC</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Expires in
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{claim.expiryDays} Days</span>
              </div>
            </div>
          </div>

          {/* Explorer Link */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">Transaction</span>
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-arc-400 hover:underline flex items-center gap-1"
            >
              <span>{claim.depositTxHash.slice(0, 6)}...{claim.depositTxHash.slice(-4)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-full text-xs"
            >
              Done
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleCopy}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
              className="w-full text-xs font-semibold shadow-arc-glow"
            >
              Copy Claim Link
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
