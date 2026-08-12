import React from "react";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export function SecurityNotice() {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-arc-600/[0.08] via-arc-purple/[0.05] to-transparent border border-arc-500/20 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-arc-300">
        <ShieldCheck className="w-4 h-4 text-arc-400" />
        <span>Cryptographic Security Model</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Secret Pay uses client-side commitment proofs. Secrets are never transmitted to or stored on servers. Only the possessor of the claim preimage and the designated smart contract can unlock the escrow on Arc Testnet.
      </p>
    </div>
  );
}
