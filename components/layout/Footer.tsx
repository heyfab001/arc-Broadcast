import React from "react";
import { ARC_TESTNET } from "@/config/chains";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] py-6 px-4 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Arc Broadcast Payment</span>
          <span>&bull;</span>
          <span>Arc Ecosystem Protocol</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
          <span>Chain ID: {ARC_TESTNET.id}</span>
          <span>&bull;</span>
          <a
            href={ARC_TESTNET.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-arc-400 transition-colors"
          >
            Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}
