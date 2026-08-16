import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, KeyRound, Share2, Wallet } from "lucide-react";

export function WorkflowStepper() {
  const steps = [
    {
      number: "01",
      title: "Deposit",
      description: "Deposit tokens into escrow on Arc.",
      icon: <Lock className="w-4 h-4 text-arc-400" />,
    },
    {
      number: "02",
      title: "Claim Link",
      description: "A private link is generated for the recipient.",
      icon: <KeyRound className="w-4 h-4 text-arc-purple" />,
    },
    {
      number: "03",
      title: "Share",
      description: "Send the link directly to the recipient.",
      icon: <Share2 className="w-4 h-4 text-arc-cyan" />,
    },
    {
      number: "04",
      title: "Claim",
      description: "The recipient connects their wallet and claims.",
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        How it works
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, i) => (
          <GlassCard
            key={i}
            variant="default"
            className="p-4 relative space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                {step.icon}
              </div>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {step.number}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-white">
              {step.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
