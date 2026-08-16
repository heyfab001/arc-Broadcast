import React from "react";
import { ARC_TESTNET } from "@/config/chains";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] py-4 px-4 text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto">
        <div>
          <span>Arc Broadcast</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>{ARC_TESTNET.name}</span>
          <span>&bull;</span>
          <a
            href={ARC_TESTNET.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            ArcScan
          </a>
        </div>
      </div>
    </footer>
  );
}
