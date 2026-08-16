import React from "react";
import { ShieldCheck } from "lucide-react";

export function SecurityNotice() {
  return (
    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-xs text-slate-400">
      <ShieldCheck className="w-4 h-4 text-arc-400 shrink-0" />
      <p className="leading-relaxed">
        Claim keys are generated in your browser and never stored on a server. Only someone with the link can claim the funds.
      </p>
    </div>
  );
}
