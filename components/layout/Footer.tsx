import React from "react";

export function Footer() {
  return (
    <footer className="mt-auto py-8 text-center text-sm font-normal text-gray-500 select-none">
      <p className="inline-flex items-center gap-1.5 justify-center">
        <span>Built by</span>
        <a
          href="https://x.com/cd_sh73839"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          HeyFab
        </a>
        <span className="text-gray-400">·</span>
        <a
          href="https://x.com/cd_sh73839"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 transition-colors text-xs font-mono"
          aria-label="HeyFab on X"
        >
          𝕏
        </a>
      </p>
    </footer>
  );
}
