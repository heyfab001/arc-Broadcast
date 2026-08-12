import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Lock, KeyRound, Share2, Wallet } from "lucide-react";

export function WorkflowStepper() {
  const steps = [
    {
      number: "01",
      title: "Deposit",
      description: "Deposit tokens into the Arc cryptographic escrow contract.",
      icon: <Lock className="w-5 h-5 text-arc-400" />,
    },
    {
      number: "02",
      title: "Generate Claim",
      description: "Client-side private claim key and commitment are constructed.",
      icon: <KeyRound className="w-5 h-5 text-arc-purple" />,
    },
    {
      number: "03",
      title: "Share Link",
      description: "Send private claim link securely to your intended recipient.",
      icon: <Share2 className="w-5 h-5 text-arc-cyan" />,
    },
    {
      number: "04",
      title: "Recipient Claims",
      description: "Receiver connects their wallet and claims directly on Arc.",
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          How Secret Pay Works
        </h3>
        <span className="text-xs text-arc-400 font-mono">Zero-Knowledge Workflow</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <GlassCard
            key={i}
            variant="subtle"
            className="p-4 relative hover:border-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform">
                {step.icon}
              </div>
              <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-slate-400 transition-colors">
                {step.number}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-arc-300 transition-colors">
              {step.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {step.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
