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
  ShieldAlert,
  Clock,
  Coins,
  X,
  Share2,
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
        title: "Link Copied!",
        message: "Private claim link copied to your clipboard.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast({
        title: "Copy Failed",
        message: "Please manually copy the link from the text box.",
        type: "error",
      });
    }
  };

  const txUrl = `${ARC_TESTNET.explorerUrl}/tx/${claim.depositTxHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg relative">
        <GlassCard
          variant="glow"
          glowColor="cyan"
          className="p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Secret Payment Created!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your {claim.amount} USDC is securely locked in the Arc smart contract escrow.
            </p>
          </div>

          {/* Claim Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Private Claim Link</span>
              <span className="text-[10px] text-arc-cyan font-mono">Zero-Knowledge Fragment</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={claim.claimUrl}
                className="w-full h-11 bg-[#090C16] border border-arc-500/40 rounded-xl px-3.5 text-xs text-arc-200 font-mono select-all outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                className="shrink-0 h-11 px-4 shadow-arc-glow"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Summary Details */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Amount Locked
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-bold text-white">
                <Coins className="w-3.5 h-3.5 text-arc-cyan" />
                <span>{claim.amount} USDC</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Expiry
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{claim.expiryDays} Days</span>
              </div>
            </div>
          </div>

          {/* ArcScan Tx Link */}
          <div className="p-3 rounded-xl bg-arc-600/10 border border-arc-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">On-Chain Deposit Tx:</span>
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-arc-400 hover:text-arc-300 flex items-center gap-1 transition-colors"
            >
              <span>{claim.depositTxHash.slice(0, 8)}...{claim.depositTxHash.slice(-6)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Security Alert */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Important:</strong> Share this link only with the intended recipient. Anyone with this link can claim the funds into their wallet. The secret code is stored exclusively in the link hash.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
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
              leftIcon={<Share2 className="w-4 h-4" />}
              className="w-full text-xs font-bold shadow-arc-glow"
            >
              Copy & Share
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
