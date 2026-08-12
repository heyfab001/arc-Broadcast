"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ArcLogo } from "@/components/common/ArcLogo";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090F]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo & Hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <ArcLogo size="sm" withText={false} />
            <span className="font-bold text-sm text-white tracking-tight">
              Arc Broadcast
            </span>
          </Link>
        </div>

        {/* Desktop Left breadcrumb/status */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-arc-500 animate-pulse" />
          <span>Arc Ecosystem dApp</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Financial Payment Protocol</span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <NetworkBadge />
          <WalletButton />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#0A0D18] px-4 py-4 space-y-1.5 animate-slide-down">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-arc-600/20 text-white border border-arc-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
