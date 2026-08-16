import React from "react";
import { ARC_TESTNET } from "@/config/chains";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] py-5 px-4 text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto px-4">
        <div>
          <span>Arc Broadcast Payment</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>{ARC_TESTNET.name}</span>
          <span>&bull;</span>
          <a
            href={ARC_TESTNET.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-arc-400 transition-colors"
          >
            ArcScan
          </a>
        </div>
      </div>
    </footer>
  );
}
