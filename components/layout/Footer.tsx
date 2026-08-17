import React from "react";
import { ARC_TESTNET } from "@/config/chains";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-6 px-4 text-sm text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Arc Broadcast</span>
          <span className="text-gray-400">•</span>
          <span>Payments on Arc</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-gray-500">
          <span>{ARC_TESTNET.name}</span>
          <span>•</span>
          <a
            href={ARC_TESTNET.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            ArcScan
          </a>
        </div>
      </div>
    </footer>
  );
}
